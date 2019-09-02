import request from 'supertest';
import { DBdisconnect, DBconnect } from '../../testConfig/db';
import app from '../../src/app';

describe('TESTS FOR USER ROUTE', () => {
  beforeAll(async () => {
    await DBconnect();
  });

  afterAll(async () => {
    await DBdisconnect();
  });

  describe('signup route', () => {
    const user = {
      username: 'joe',
      email: 'joeabetang@gmail.com',
      password: 'pass1234',
      isAdmin: true,
    };

    it('checks that user was created and returns the right status code', async () => {
      await request(app)
        .post('/api/v1/user/signup')
        .send(user)
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body.data).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              email: 'joeabetang@gmail.com',
              username: 'joe',
              isAdmin: true,
            }),
          );
        });
    });

    it('checks that it throws error on attempt to signup using an existing email address', async () => {
      await request(app)
        .post('/api/v1/user/signup')
        .send(user)
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch('user already exists');
        });
    });

    it('validates and send an appropraite message if a field is missing', async () => {
      await request(app)
        .post('/api/v1/user/signup')
        .send({
          username: 'Sansa',
          email: 'sansa@gameofthrones.io',
          isAdmin: false,
        })
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch('password is required');
        });
    });
  });
});
