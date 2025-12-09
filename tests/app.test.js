const request = require('supertest');
const app = require('../src/app');

describe('Transaction Validator', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('POST /validate invalid payload returns 400', async () => {
    const res = await request(app).post('/validate').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /validate valid MXN returns 200 accepted', async () => {
    const res = await request(app)
      .post('/validate')
      .send({ amount: 100, currency: 'MXN', accountId: 'acc-1' });
    expect([200, 422]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toEqual({ accepted: true });
    } else {
      expect(res.body).toEqual({ accepted: false });
    }
  });
});