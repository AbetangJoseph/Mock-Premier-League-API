import request from 'supertest';
import { DBdisconnect, DBconnect } from '../../testConfig/db';
import app from '../../src/app';
import { signup } from '../../src/controllers/user';

describe('TESTS FOR TEAMS ROUTE', () => {
  let adminToken: string;
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    await DBconnect();

    await signup({
      username: 'joseph',
      email: 'joeabetang@gmail.com',
      password: 'mysecret',
      isAdmin: true,
    });

    await signup({
      username: 'anybody',
      email: 'anybody@gmail.com',
      password: 'yoursecret',
      isAdmin: false,
    });

    await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'joeabetang@gmail.com', password: 'mysecret' })
      .set('Accept', 'application/json')
      .then(res => (adminToken = res.body.token));

    await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'anybody@gmail.com', password: 'yoursecret' })
      .set('Accept', 'application/json')
      .then(res => (userToken = res.body.token));
  });

  afterAll(async () => {
    await DBdisconnect();
  });

  describe('Add Team Route', () => {
    const inCompleteTeamInfo = {
      clubName: '',
      clubCodeName: 'fcb',
      founded: 1899,
      coach: 'Ernesto Valverde',
      country: 'Spain',
      stadium: 'Camp Nou',
      stadiumCapacity: 99354,
    };

    const completeTeamInfo = {
      clubName: 'FC Barcelona',
      clubCodeName: 'fcb',
      founded: 1899,
      coach: 'Ernesto Valverde',
      country: 'Spain',
      stadium: 'Camp Nou',
      stadiumCapacity: 99354,
    };

    it('returns status code 403 and a message body if post is made without a token', async () => {
      await request(app)
        .post('/api/v1/teams')
        .send(inCompleteTeamInfo)
        .set('Accept', 'application/json')
        .then(res => {
          expect(res.status).toBe(403);
          expect(res.body.error).toMatch('You must login');
        });
    });

    it('returns status code 403 and a message body if "Bearer" exists but no token', async () => {
      await request(app)
        .post('/api/v1/teams')
        .send(inCompleteTeamInfo)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer `)
        .then(res => {
          expect(res.status).toBe(403);
          expect(res.body.error).toMatch('Forbidden');
        });
    });

    it('validates and send an appropraite message if field(s) missing', async () => {
      await request(app)
        .post('/api/v1/teams')
        .send(inCompleteTeamInfo)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch('clubName is not allowed to be empty');
        });
    });

    it('throws error with an appropraite status code when an unauthorized user tries to create a team', async () => {
      await request(app)
        .post('/api/v1/teams')
        .send(completeTeamInfo)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${userToken}`)
        .then(res => {
          expect(res.status).toBe(401);
          expect(res.body.error).toMatch('Unauthorized');
        });
    });

    it('throws error with an appropraite status code if token has been altered', async () => {
      await request(app)
        .post('/api/v1/teams')
        .send(completeTeamInfo)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}i`)
        .then(res => {
          expect(res.status).toBe(500);
          expect(res.body.message).toMatch('invalid signature');
        });
    });

    it('adds a new team and return the created team', async () => {
      await request(app)
        .post('/api/v1/teams')
        .send(completeTeamInfo)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}`)
        .then(res => {
          userId = res.body.data._id;
          expect(res.status).toBe(200);
          expect(res.body.data).toMatchObject({
            _id: expect.any(String),
            clubCodeName: 'FCB',
            clubName: 'FC Barcelona',
            coach: 'Ernesto Valverde',
            country: 'Spain',
            founded: 1899,
            logo: 'logo',
            stadium: 'Camp Nou',
            stadiumCapacity: 99354,
          });
        });
    });

    it('throws error with an appropraite status code on attempt to add an existing team', async () => {
      await request(app)
        .post('/api/v1/teams')
        .send(completeTeamInfo)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch('team already exists');
        });
    });
  });

  describe('Remove Team Route', () => {
    it('deletes a team and returns an appropraite status code and deleted team id', async () => {
      await request(app)
        .delete(`/api/v1/teams/${userId}`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body.success).toBeTruthy();
          expect(res.body.data.id).toMatch(`${userId}`);
        });
    });

    it('throws error with an appropraite status code when trying to delete an already deleted team', async () => {
      await request(app)
        .delete(`/api/v1/teams/${userId}`)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch('no such team');
        });
    });
  });
});
