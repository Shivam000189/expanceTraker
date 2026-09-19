import { describe, it, expect } from 'vitest';
import {
  getCategory,
  groupByCategory,
  groupByDay,
  calculateRunRateForecast,
  getBudgetThresholdStatus,
  generateExpensesCsv,
  CATEGORY_CONFIG
} from './analytics';

describe('Frontend Analytics Financial Utilities', () => {
  describe('getCategory', () => {
    it('returns the category config for existing categories', () => {
      const food = getCategory('Food');
      expect(food).toBeDefined();
      expect(food.icon).toBe('🍔');
      expect(food.color).toBe('#7C3AED');
    });

    it('falls back to Other config for unknown categories', () => {
      const unknown = getCategory('NonExistentCategory');
      expect(unknown).toEqual(CATEGORY_CONFIG['Other']);
    });
  });

  describe('groupByCategory', () => {
    it('aggregates amounts by category and sorts descending', () => {
      const expenses = [
        { category: 'Food', amount: 200 },
        { category: 'Travel', amount: 500 },
        { category: 'Food', amount: 300 },
        { category: 'Shopping', amount: 150 },
      ];

      const grouped = groupByCategory(expenses);
      expect(grouped).toEqual([
        { name: 'Food', amount: 500 },
        { name: 'Travel', amount: 500 },
        { name: 'Shopping', amount: 150 },
      ]);
    });

    it('defaults undefined or empty category to Other', () => {
      const expenses = [
        { category: null, amount: 100 },
        { category: '', amount: 50 },
      ];

      const grouped = groupByCategory(expenses);
      expect(grouped).toEqual([{ name: 'Other', amount: 150 }]);
    });

    it('handles empty expense list gracefully', () => {
      const grouped = groupByCategory([]);
      expect(grouped).toEqual([]);
    });
  });

  describe('groupByDay', () => {
    it('aggregates expenses by ISO date and sorts descending', () => {
      const expenses = [
        { date: '2026-09-01T10:00:00Z', amount: 100 },
        { date: '2026-09-02T12:00:00Z', amount: 600 },
        { date: '2026-09-01T15:00:00Z', amount: 200 },
      ];

      const grouped = groupByDay(expenses);
      expect(grouped).toEqual([
        { date: '2026-09-02', amount: 600 },
        { date: '2026-09-01', amount: 300 },
      ]);
    });

    it('limits output to top 5 spending days', () => {
      const expenses = [
        { date: '2026-09-01', amount: 10 },
        { date: '2026-09-02', amount: 20 },
        { date: '2026-09-03', amount: 30 },
        { date: '2026-09-04', amount: 40 },
        { date: '2026-09-05', amount: 50 },
        { date: '2026-09-06', amount: 60 },
        { date: '2026-09-07', amount: 70 },
      ];

      const grouped = groupByDay(expenses);
      expect(grouped.length).toBe(5);
      expect(grouped[0]).toEqual({ date: '2026-09-07', amount: 70 });
      expect(grouped[4]).toEqual({ date: '2026-09-03', amount: 30 });
    });

    it('handles missing dates gracefully with Unknown bucket', () => {
      const expenses = [{ amount: 45 }];
      const grouped = groupByDay(expenses);
      expect(grouped).toEqual([{ date: 'Unknown', amount: 45 }]);
    });
  });

  describe('calculateRunRateForecast', () => {
    it('calculates run rate and projected month-end spend accurately', () => {
      // 10th of September 2026 (September has 30 days)
      const refDate = new Date('2026-09-10T12:00:00Z');
      const expenses = [
        { date: '2026-09-02', amount: 1000 },
        { date: '2026-09-05', amount: 2000 },
        { date: '2026-09-10', amount: 1000 },
        // Previous month expense should be excluded
        { date: '2026-08-25', amount: 5000 },
      ];

      const forecast = calculateRunRateForecast(expenses, 20000, refDate);
      expect(forecast.spentSoFar).toBe(4000);
      expect(forecast.daysElapsed).toBe(10);
      expect(forecast.daysInMonth).toBe(30);
      expect(forecast.dailyRunRate).toBe(400); // 4000 / 10
      expect(forecast.projectedMonthEnd).toBe(12000); // 400 * 30
      expect(forecast.riskLevel).toBe('on-track');
      expect(forecast.projectedSavings).toBe(8000); // 20000 - 12000
    });

    it('identifies over-budget risk when projected spend exceeds monthly income', () => {
      const refDate = new Date('2026-09-10T12:00:00Z');
      const expenses = [
        { date: '2026-09-05', amount: 15000 },
      ];

      const forecast = calculateRunRateForecast(expenses, 30000, refDate);
      // Run rate = 1500/day -> projected 45,000 > 30,000
      expect(forecast.projectedMonthEnd).toBe(45000);
      expect(forecast.riskLevel).toBe('over-budget');
      expect(forecast.projectedSavings).toBe(0);
    });
  });

  describe('getBudgetThresholdStatus', () => {
    it('returns safe status when spending is under 75%', () => {
      const status = getBudgetThresholdStatus(500, 1000);
      expect(status.status).toBe('safe');
      expect(status.percentage).toBe(50);
    });

    it('returns warning status when spending is between 75% and 99%', () => {
      const status = getBudgetThresholdStatus(800, 1000);
      expect(status.status).toBe('warning');
      expect(status.percentage).toBe(80);
    });

    it('returns exceeded status when spending reaches or exceeds 100%', () => {
      const status = getBudgetThresholdStatus(1100, 1000);
      expect(status.status).toBe('exceeded');
      expect(status.percentage).toBe(110);
    });

    it('handles zero or missing limit gracefully', () => {
      const status = getBudgetThresholdStatus(500, 0);
      expect(status.status).toBe('none');
    });
  });

  describe('generateExpensesCsv', () => {
    it('generates well-formed CSV with headers and quoted fields', () => {
      const expenses = [
        { date: '2026-09-01T00:00:00.000Z', title: 'Groceries, Supermarket', category: 'Food', amount: 550 },
        { date: '2026-09-02T00:00:00.000Z', title: 'Metro "Card" Recharge', category: 'Travel', amount: 200 },
      ];

      const csv = generateExpensesCsv(expenses);
      const lines = csv.split('\n');

      expect(lines[0]).toBe('Date,Title,Category,Amount');
      expect(lines[1]).toContain('2026-09-01');
      expect(lines[1]).toContain('"Groceries, Supermarket"');
      expect(lines[1]).toContain('"Food"');
      expect(lines[1]).toContain('550');
      expect(lines[2]).toContain('"Metro ""Card"" Recharge"');
    });
  });
});
