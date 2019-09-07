import {
  add,
  remove,
  edit,
  viewAll,
  searchTeam,
} from '../../src/controllers/teams';
import { DBdisconnect, DBconnect } from '../../testConfig/db';

describe('TESTS FOR TEAMS CONTROLLER', () => {
  let teamId: string;

  beforeAll(async () => {
    await DBconnect();
  });

  afterAll(async () => {
    await DBdisconnect();
  });

  describe('Add Team Controller', () => {
    const team = {
      clubName: 'Real Madrid',
      clubCodeName: 'fcb',
      founded: 1899,
      coach: 'Ernesto Valverde',
      country: 'Brazil',
      stadium: 'Camp Nou',
      stadiumCapacity: 99354,
    };

    const team2 = {
      clubName: 'F.C. Paris Saint Germain',
      clubCodeName: 'PSG',
      founded: 1905,
      coach: 'Ernesto Valverde',
      country: 'France',
      stadium: 'Stadium',
      stadiumCapacity: 99354,
    };

    it('checks that team was created and has clubName & id properties', async () => {
      await add(team2);
      await add(team).then(res => {
        teamId = res._id;
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

  describe('Edit Team Controller', () => {
    it('updates team and return the updated document', async () => {
      await edit(teamId, { clubName: 'FC Barcelona', country: 'Spain' }).then(
        res => {
          expect(res.country).toMatch('Spain');
          expect(res.clubName).toMatch('FC Barcelona');
        },
      );
    });

    it('throws error if team to update is not found or has aleady been deleted', async () => {
      try {
        await edit('5d6eb3bc764892764a0bd5ae', {
          clubName: 'FC Barcelona',
          country: 'Spain',
        });
      } catch (error) {
        expect(error).toEqual(new Error('no such team'));
      }
    });
  });

  describe('View All Team Controller', () => {
    it('view all teams', async () => {
      await viewAll().then(res => {
        expect(res).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              clubName: 'FC Barcelona',
              clubCodeName: 'fcb',
              founded: 1899,
              coach: 'Ernesto Valverde',
              country: 'Spain',
              stadium: 'Camp Nou',
              stadiumCapacity: 99354,
            }),
          ]),
        );
      });
    });
  });

  describe('Search Team Controller', () => {
    it('should search for a team by clubCodeName and return teams that match', async () => {
      await searchTeam({ clubCodeName: 'B' }).then(res => {
        expect(res).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              clubName: 'FC Barcelona',
              clubCodeName: 'fcb',
              founded: 1899,
              coach: 'Ernesto Valverde',
              country: 'Spain',
              stadium: 'Camp Nou',
              stadiumCapacity: 99354,
            }),
          ]),
        );
      });
    });

    it('should throw error if no match is found', async () => {
      try {
        await searchTeam({ clubCodeName: 'BS' });
      } catch (error) {
        expect(error).toEqual(new Error('no match found'));
      }
    });

    it('should throw error if no match is found', async () => {
      try {
        await searchTeam({ founded: 1234 });
      } catch (error) {
        expect(error).toEqual(
          new Error(
            'please you cannot search by founded or stadiumCapacity yet',
          ),
        );
      }
    });
  });

  describe('Remove Team Controller', () => {
    it('throws error if team is not found or has already been deleted', async () => {
      try {
        await remove('5d6eb3bc764892764a0bd5ae');
      } catch (error) {
        expect(error).toEqual(new Error('no such team'));
      }
    });

    it('removes team', async () => {
      await remove(teamId).then(res => {
        expect(res).toBe(`${teamId}`);
      });
    });
  });
});
