import { add as addTeam } from '../../src/controllers/teams';
import {
  add,
  remove,
  edit,
  viewAll,
  viewCompleted,
  viewPending,
  searchFixture,
  getLink,
} from '../../src/controllers/fixtures';
import { DBdisconnect, DBconnect } from '../../testConfig/db';

describe('TESTS FOR FIXTURES CONTROLLER', () => {
  let homeId: string;
  let awayId: string;
  let fixtureId: string;
  let fxtureLink: any;

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

    await addTeam(home).then(res => {
      homeId = res._id;
    });

    await addTeam(away).then(res => {
      awayId = res._id;
    });

    await add({
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

  describe('Add fixture Controller', () => {
    it('should add fixture and return fixture added', async () => {
      const fixture = {
        home: `${homeId}`,
        away: `${awayId}`,
        venue: 'Old trafford',
        time: '1200GMT',
        date: 'monday 12 2019',
      };
      await add(fixture).then(res => {
        fixtureId = res!._id;
        fxtureLink = res!.link || '';
        expect(res).toHaveProperty('link');
        expect(res).toHaveProperty('home');
        expect(res).toHaveProperty('away');
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
      try {
        await add(fixture);
      } catch (error) {
        expect(error).toEqual(new Error('team cannot play against itself'));
      }
    });

    it('should throw error if fixture already exists', async () => {
      const fixture = {
        home: `${homeId}`,
        away: `${awayId}`,
        venue: 'Old trafford',
        time: '1200GMT',
        date: 'monday 12 2019',
      };
      try {
        await add(fixture);
      } catch (error) {
        expect(error).toEqual(new Error('fixture already exists'));
      }
    });
  });

  describe('Edit Fixture Controller', () => {
    it('updates fixture and return the updated document', async () => {
      await edit(fixtureId, {
        venue: 'Wembly',
        date: '2019-05-19T00:00:00+00:00',
      }).then(res => {
        expect(res.venue).toMatch('Wembly');
        expect(res.date).toMatch('2019-05-19T00:00:00+00:00');
      });
    });

    it('throws error if fixture to update is not found or has aleady been deleted', async () => {
      try {
        await edit('5d6eb3bc764892764a0bd5ae', {
          venue: 'Wembly',
          date: '2019-05-19T00:00:00+00:00',
        });
      } catch (error) {
        expect(error).toEqual(new Error('no such fixture'));
      }
    });
  });

  describe('View All Fixtures Controller', () => {
    it('view all fixtures', async () => {
      await viewAll().then(res => {
        expect(res).toEqual(
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

  describe('View Completed Fixtures Controller', () => {
    it('view completed fixtures', async () => {
      await viewCompleted().then(res => {
        expect(res).toEqual(
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

  describe('View Pending Fixtures Controller', () => {
    it('view pending fixtures', async () => {
      await viewPending().then(res => {
        expect(res).toEqual(
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

  describe('GetLink Fixtures Controller', () => {
    it('view a fixture with a given unique link', async () => {
      await getLink(`${fxtureLink.split('/')[6]}`).then(res => {
        expect(res).toHaveProperty('venue');
      });
    });

    it('should throw error if fixture not found or invalid link', async () => {
      try {
        await getLink('http://localhost:3000/api/v1/fixtures/NthhB-N');
      } catch (error) {
        expect(error).toEqual(new Error('not found'));
      }
    });
  });

  describe('Search Fixture Controller', () => {
    it('should search for a fixture by date and return fixtures that match', async () => {
      await searchFixture({ date: '20' }).then(res => {
        expect(res[0]).toHaveProperty('link');
        expect(res).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              isDeleted: false,
            }),
          ]),
        );
      });
    });

    it('should search for a fixture by date and return fixtures that match', async () => {
      await searchFixture({ date: '20' }).then(res => {
        expect(res[0]).toHaveProperty('link');
        expect(res).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              isDeleted: false,
            }),
          ]),
        );
      });
    });

    it('should throw error if no match is found', async () => {
      try {
        await searchFixture({ date: 'hahaha' });
      } catch (error) {
        expect(error).toEqual(new Error('no match found'));
      }
    });

    it('should throw error if search is not based on status, date or time', async () => {
      try {
        await searchFixture({ home: 'chelsea' });
      } catch (error) {
        expect(error).toEqual(
          new Error('you can only search by status, date or time'),
        );
      }
    });
  });

  describe('Remove Fixture Controller', () => {
    it('throws error if fixture is not found or has already been deleted', async () => {
      try {
        await remove('5d6eb3bc764892764a0bd5ae');
      } catch (error) {
        expect(error).toEqual(new Error('no such fixture'));
      }
    });

    it('removes team', async () => {
      await remove(fixtureId).then(res => {
        expect(res).toBe(`${fixtureId}`);
      });
    });
  });
});
