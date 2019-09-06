import { add as addTeam } from '../../src/controllers/teams';
import { add } from '../../src/controllers/fixtures';
import { DBdisconnect, DBconnect } from '../../testConfig/db';

describe('TESTS FOR FIXTURES CONTROLLER', () => {
  let homeId: string;
  let awayId: string;

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
});