import request from 'supertest';
import { DBdisconnect, DBconnect } from '../../testConfig/db';
import { add as addTeam } from '../../src/controllers/teams';
import app from '../../src/app';
import { signup } from '../../src/controllers/user';

describe('TESTS FOR FIXTURES ROUTE', () => {
  let homeId: string;
  let awayId: string;
  let adminToken: string;

  beforeAll(async () => {
    await DBconnect();

    const home = {
      clubName: 'Atletico De Mardird',
      clubCodeName: 'ATM',
      founded: 1899,
      coach: 'Ernesto Valverde',
      country: 'Spain',
      stadium: 'Camp Nou',
      stadiumCapacity: 99354,
    };

    const away = {
      clubName: 'Real Madrid',
      clubCodeName: 'RMD',
      founded: 1899,
      coach: 'Ernesto Valverde',
      country: 'Spain',
      stadium: 'Camp Nou',
      stadiumCapacity: 99354,
    };

    await signup({
      username: 'joseph',
      email: 'joeabetang@gmail.com',
      password: 'mysecret',
      isAdmin: true,
    });

    await addTeam(home).then(res => {
      homeId = res._id;
    });

    await addTeam(away).then(res => {
      awayId = res._id;
    });

    await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'joeabetang@gmail.com', password: 'mysecret' })
      .set('authorization', `Bearer ${adminToken}`)
      .set('Accept', 'application/json')
      .then(res => (adminToken = res.body.token));
  });

  afterAll(async () => {
    await DBdisconnect();
  });

  describe('Add fixture Controller', () => {
    it('should add fixture and return fixture added', async () => {
      const fixture = {
        home: `${homeId}`,
        away: `${awayId}`,
        venue: 'Old trafford',
        time: '1200GMT',
        date: 'monday 12 2019',
      };
      await request(app)
        .post('/api/v1/fixtures')
        .send(fixture)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body.success).toBeTruthy();
          expect(res.body.data).toHaveProperty('link');
          expect(res.body.data).toHaveProperty('home');
          expect(res.body.data).toHaveProperty('away');
        });
    });

    it('should throw error if field(s) empty', async () => {
      const fixture = {
        home: `${homeId}`,
        away: `${awayId}`,
        venue: '',
        time: '1200GMT',
        date: 'monday 12 2019',
      };
      await request(app)
        .post('/api/v1/fixtures')
        .send(fixture)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBeTruthy();
          expect(res.body.error).toEqual('venue is not allowed to be empty');
        });
    });

    it('should throw error if the same team is home and away', async () => {
      const fixture = {
        home: `${homeId}`,
        away: `${homeId}`,
        venue: 'Old trafford',
        time: '1200GMT',
        date: 'monday 12 2019',
      };
      await request(app)
        .post('/api/v1/fixtures')
        .send(fixture)
        .set('Accept', 'application/json')
        .set('authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBeTruthy();
          expect(res.body.error).toEqual('team cannot play against itself');
        });
    });
  });
});
