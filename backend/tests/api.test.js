const request = require('supertest');
const app = require('../index');

describe('API Route Integration Tests', () => {
    describe('System & Health Endpoints', () => {
        test('GET /health returns 200 and status OK', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status', 'OK');
            expect(res.body).toHaveProperty('timestamp');
        });

        test('GET / returns API metadata and version', async () => {
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('version', '1.0.0');
            expect(res.body.message).toContain('Expense Tracker API');
        });

        test('GET non-existent route returns 404', async () => {
            const res = await request(app).get('/api/unknown-endpoint-404');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Route not found');
        });
    });

    describe('Auth Validation & Token Guard Tests', () => {
        test('GET /verify-token without Authorization header returns 401', async () => {
            const res = await request(app).get('/verify-token');
            expect(res.status).toBe(401);
            expect(res.body.valid).toBe(false);
            expect(res.body.message).toBe('No token provided');
        });

        test('GET /verify-token with malformed token returns 401', async () => {
            const res = await request(app)
                .get('/verify-token')
                .set('Authorization', 'Bearer invalid-token-string');
            expect(res.status).toBe(401);
            expect(res.body.valid).toBe(false);
        });

        test('POST /auth/register without credentials returns 400 Bad Request', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('All fields are required');
            expect(res.body.msg).toBe('All fields are required');
        });

        test('POST /auth/login without credentials returns 400 Bad Request', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('All fields are required');
            expect(res.body.msg).toBe('All fields are required');
        });
    });

    describe('Protected Routes Security Tests', () => {
        test('GET /expenses without token is rejected with 401', async () => {
            const res = await request(app).get('/expenses');
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
            expect(res.body.msg).toBe('Access denied. No token provided.');
        });

        test('POST /expenses without token is rejected with 401', async () => {
            const res = await request(app)
                .post('/expenses')
                .send({ title: 'Coffee', amount: 120, category: 'Food' });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });

        test('GET /bank/balance without token is rejected with 401', async () => {
            const res = await request(app).get('/bank/balance');
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });

        test('POST /bank/transfer without token is rejected with 401', async () => {
            const res = await request(app)
                .post('/bank/transfer')
                .send({ recipientId: 'target@example.com', amount: 100 });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });
    });
});
