// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', locale: 'en-IN', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', locale: 'en-US', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', locale: 'de-DE', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', label: 'GBP (£)' },
];

export function getActiveCurrency() {
  if (typeof window === 'undefined') return 'INR';
  return localStorage.getItem('preferredCurrency') || 'INR';
}

export function formatCurrency(amount, currencyCode = null) {
  const code = currencyCode || getActiveCurrency();
  const config = SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];

  if (amount === undefined || amount === null) return `${config.symbol}0`;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}