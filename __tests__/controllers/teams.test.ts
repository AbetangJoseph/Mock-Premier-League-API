import { add } from '../../src/controllers/teams';
import { DBdisconnect, DBconnect } from '../../testConfig/db';

describe('TESTS FOR TEAMS CONTROLLER', () => {
  beforeAll(async () => {
    await DBconnect();
  });

  afterAll(async () => {
    await DBdisconnect();
  });

  describe('Add Team Controller', () => {
    const team = {
      clubName: 'FC Barcelona',
      clubCodeName: 'fcb',
      founded: 1899,
      coach: 'Ernesto Valverde',
      country: true,
      stadium: 'Camp Nou',
      stadiumCapacity: 99354,
    };

    it('checks that team was created and has clubName & id properties', async () => {
      const result = await add(team);
      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('clubName');
    });

    it('throws error on attempt to add a team that matches an existing team', async () => {
      try {
        await add(team);
      } catch (error) {
        expect(error).toEqual(new Error('team already exists'));
      }
    });
  });
});
