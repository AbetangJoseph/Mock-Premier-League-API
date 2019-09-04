import { add, remove } from '../../src/controllers/teams';
import { DBdisconnect, DBconnect } from '../../testConfig/db';

describe('TESTS FOR TEAMS CONTROLLER', () => {
  let userId: string;

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
      await add(team).then(res => {
        userId = res._id;
        expect(res).toHaveProperty('_id');
        expect(res).toHaveProperty('clubName');
      });
    });

    it('throws error on attempt to add a team that matches an existing team', async () => {
      try {
        await add(team);
      } catch (error) {
        expect(error).toEqual(new Error('team already exists'));
      }
    });
  });

  describe('Remove Team Controller', () => {
    it('throws error if team is no found or has already been deleted', async () => {
      try {
        await remove('5d6eb3bc764892764a0bd5ae');
      } catch (error) {
        expect(error).toEqual(new Error('no such team'));
      }
    });

    it('removes team', async () => {
      await remove(userId).then(res => {
        expect(res).toBe(`${userId}`);
      });
    });
  });
});
