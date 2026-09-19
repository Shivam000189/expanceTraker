const {
    DEFAULT_CATEGORY,
    inferCategory,
    normalizeDetection,
    extractJson,
    normalizeDate
} = require('../utils/smsParser');

describe('SMS Parser & Category Inference Unit Tests', () => {
    describe('inferCategory', () => {
        test('infers Food category from keywords', () => {
            expect(inferCategory('Paid Rs. 350 at Swiggy')).toBe('Food');
            expect(inferCategory('Order confirmed at Zomato restaurant')).toBe('Food');
            expect(inferCategory('Payment for burger cafe')).toBe('Food');
        });

        test('infers Travel category from keywords', () => {
            expect(inferCategory('Paid at Uber ride')).toBe('Travel');
            expect(inferCategory('Metro ticket recharge via Ola')).toBe('Travel');
            expect(inferCategory('Petrol pump fuel payment')).toBe('Travel');
            expect(inferCategory('IRCTC train ticket booking')).toBe('Travel');
        });

        test('infers Shopping category from keywords', () => {
            expect(inferCategory('Purchased item on Amazon')).toBe('Shopping');
            expect(inferCategory('Flipkart marketplace payment')).toBe('Shopping');
            expect(inferCategory('Myntra order delivered')).toBe('Shopping');
        });

        test('infers Bills category from keywords', () => {
            expect(inferCategory('Electricity bill payment successful')).toBe('Bills');
            expect(inferCategory('Mobile broadband wifi recharge')).toBe('Bills');
        });

        test('infers Entertainment category from keywords', () => {
            expect(inferCategory('Netflix monthly subscription')).toBe('Entertainment');
            expect(inferCategory('Bookmyshow movie tickets')).toBe('Entertainment');
            expect(inferCategory('Spotify premium renewal')).toBe('Entertainment');
        });

        test('infers Health category from keywords', () => {
            expect(inferCategory('Apollo pharmacy medicine purchase')).toBe('Health');
            expect(inferCategory('Doctor consultation at clinic')).toBe('Health');
        });

        test('falls back to Other category for unrecognized keywords', () => {
            expect(inferCategory('Sent to random acquaintance')).toBe(DEFAULT_CATEGORY);
        });
    });

    describe('normalizeDetection', () => {
        test('extracts amount, merchant, and category from raw bank SMS', () => {
            const sms = 'Rs 450.00 spent on Swiggy using HDFC Bank Card on 12 Jan';
            const result = normalizeDetection(null, sms);

            expect(result.amount).toBe(450);
            expect(result.merchant).toContain('Swiggy');
            expect(result.category).toBe('Food');
            expect(result.type).toBe('expense');
        });

        test('detects income when credit keyword is present', () => {
            const sms = 'INR 50,000.00 credited to your A/C from Employer using NEFT';
            const result = normalizeDetection(null, sms);

            expect(result.amount).toBe(50000);
            expect(result.type).toBe('income');
        });

        test('respects pre-structured payload override', () => {
            const payload = {
                amount: 1200,
                merchant: 'Custom Merchant',
                category: 'Travel',
                type: 'expense'
            };
            const result = normalizeDetection(payload, 'Raw SMS content');

            expect(result.amount).toBe(1200);
            expect(result.merchant).toBe('Custom Merchant');
            expect(result.category).toBe('Travel');
        });
    });

    describe('extractJson', () => {
        test('parses json enclosed in markdown code fences or conversational text', () => {
            const input = 'Here is the extracted transaction: {"amount": 250, "merchant": "Uber"} Thank you!';
            const parsed = extractJson(input);

            expect(parsed).toEqual({ amount: 250, merchant: 'Uber' });
        });
    });
});
