import request from 'supertest';
import { DBdisconnect, DBconnect } from '../../testConfig/db';
import { add as addTeam } from '../../src/controllers/teams';
import { add as addFixture } from '../../src/controllers/fixtures';
import app from '../../src/app';
import { signup } from '../../src/controllers/user';

describe('TESTS FOR FIXTURES ROUTE', () => {
  let homeId: string;
  let awayId: string;
  let adminToken: string;
  let fixtureId: string;

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

    await addFixture({
      home: `${homeId}`,
      away: `${awayId}`,
      venue: 'Allianz Field',
      time: '1200GMT',
      date: 'September 11 2019',
      status: 'completed',
    });
  });

  afterAll(async () => {
    await DBdisconnect();
  });

  describe('Add fixture Route', () => {
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
          fixtureId = res.body.data!._id;
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

    describe('Edit Fixture Route', () => {
      it('updates/edit fixture and returns an appropraite status code and the updated document', async () => {
        await request(app)
          .put(`/api/v1/fixtures/${fixtureId}`)
          .send({ venue: 'Wembly', date: '2019-05-19T00:00:00+00:00' })
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data).toEqual(
              expect.objectContaining({
                venue: 'Wembly',
                date: '2019-05-19T00:00:00+00:00',
              }),
            );
          });
      });

      it('throws error with an appropraite status code if update/edit input value(s) violates validation constraints', async () => {
        await request(app)
          .put(`/api/v1/fixtures/${fixtureId}`)
          .send({ venue: 33, date: '2019-05-19T00:00:00+00:00' })
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBeTruthy();
            expect(res.body.error).toMatch('venue must be a string');
          });
      });

      it('throws error with an appropraite status code when trying to update/edit a deleted fixture', async () => {
        await request(app)
          .put('/api/v1/fixtures/5d6eb3bc764892764a0bd5ae')
          .send({ venue: 'Wembly', date: '2019-05-19T00:00:00+00:00' })
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBeTruthy();
          });
      });
    });

    describe('View Completed Fixtures Route', () => {
      it('view completed fixtures', async () => {
        await request(app)
          .get('/api/v1/fixtures/complete')
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  goalsHomeTeam: 0,
                  goalsAwayTeam: 0,
                  status: 'completed',
                  elapsed: 0,
                  isDeleted: false,
                }),
              ]),
            );
          });
      });
    });

    describe('View Pending Fixtures Route', () => {
      it('view pending fixtures', async () => {
        await request(app)
          .get('/api/v1/fixtures/pending')
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  goalsHomeTeam: 0,
                  goalsAwayTeam: 0,
                  status: 'pending',
                  elapsed: 0,
                  isDeleted: false,
                }),
              ]),
            );
          });
      });
    });

    describe('View All Fixtures Route', () => {
      it('returns all fixtures', async () => {
        await request(app)
          .get(`/api/v1/fixtures/`)
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  goalsHomeTeam: 0,
                  goalsAwayTeam: 0,
                  status: 'pending',
                  elapsed: 0,
                  isDeleted: false,
                }),
              ]),
            );
          });
      });
    });

    describe('Remove Fixture Route', () => {
      it('deletes a fixture and returns an appropraite status code and deleted fixture id', async () => {
        await request(app)
          .delete(`/api/v1/fixtures/${fixtureId}`)
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data.id).toMatch(`${fixtureId}`);
          });
      });

      it('throws error with an appropraite status code when trying to delete an already deleted fixture', async () => {
        await request(app)
          .delete(`/api/v1/fixtures/${fixtureId}`)
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch('no such fixture');
          });
      });
    });
  });
});
