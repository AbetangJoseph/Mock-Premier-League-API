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
        .post('/api/v1/users/signup')
        .send(user)
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body.data).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              email: 'joeabetang@gmail.com',
              username: 'joe',
              isAdmin: true,
            }),
          );
        });
    });

    it('checks that it throws error on attempt to signup using an existing email address', async () => {
      await request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch('user already exists');
        });
    });

    it('validates and send an appropraite message if a field is missing', async () => {
      await request(app)
        .post('/api/v1/users/signup')
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

  describe('login route', () => {
    const userWithAMissingCredential = {
      email: 'joeabetang@gmail.com',
      password: '',
    };

    const userWithRightCredentials = {
      email: 'joeabetang@gmail.com',
      password: 'pass1234',
    };

    const userWithWrongCredentials = {
      email: 'joeabetang@gmail.com',
      password: 'pass123',
    };

    it('validates and send an appropraite status code and message if a field is missing', async () => {
      await request(app)
        .post('/api/v1/users/login')
        .send(userWithAMissingCredential)
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch('password is not allowed to be empty');
        });
    });

    it('sends appropriate status code and throws error if credentials are invalid', async () => {
      await request(app)
        .post('/api/v1/users/login')
        .send(userWithWrongCredentials)
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch('Invalid email or password');
        });
    });

    it('returns "success":true and a jwt token if login is successful', async () => {
      await request(app)
        .post('/api/v1/users/login')
        .send(userWithRightCredentials)
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual(
            expect.objectContaining({
              success: true,
              token: expect.any(String),
            }),
          );
        });
    });
  });
});
