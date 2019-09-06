import request from 'supertest';
import app from '../../src/app';

describe('HEALTH-CHECK', () => {
  it('should check that router on routes/index is mounted on app properly', async () => {
    await request(app)
      .get('/api/v1/health-check')
      .set('Accept', 'application/json')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.text).toMatch('OK');
      });
  });
});
