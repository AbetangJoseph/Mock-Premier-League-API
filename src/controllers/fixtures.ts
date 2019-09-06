import { FixtureModel } from '../models/fixtures';

const add = async (newFixture: any) => {
  const { home, away, date } = newFixture;

  if (home === away) {
    throw new Error('team cannot play against itself');
  }

  const existingFixture = await FixtureModel.exists({ home, away, date });

  if (!existingFixture) {
    const fixture = new FixtureModel(newFixture);
    const result = await fixture.save();
    return await FixtureModel.findOne({ _id: result.id }).populate(
      'home away',
      ' -isDeleted -logo -founded -_id -coach -country -stadium -__v -stadiumCapacity',
    );
  }
  throw new Error('fixture already exists');
};

const remove = async (fixtureId: string) => {
  const fixture = await FixtureModel.findOne({ _id: fixtureId });
  if (!fixture || fixture.isDeleted) {
    throw new Error('no such fixture');
  }
  fixture.isDeleted = true;

  const res = await fixture.save();
  return res.id;
};

const edit = async (fixtureId: string, payload: any) => {
  let fixture = await FixtureModel.findOne({ _id: fixtureId });
  if (!fixture || fixture.isDeleted) {
    throw new Error('no such fixture');
  }

  fixture.date = payload.date || fixture.date;
  fixture.goalsHomeTeam = payload.goalsHomeTeam || fixture.goalsHomeTeam;
  fixture.goalsAwayTeam = payload.goalsAwayTeam || fixture.goalsAwayTeam;
  fixture.status = payload.status || fixture.status;
  fixture.elapsed = payload.elapsed || fixture.elapsed;
  fixture.home = payload.home || fixture.home;
  fixture.away = payload.away || fixture.away;
  fixture.venue = payload.venue || fixture.venue;
  fixture.time = payload.time || fixture.time;
  fixture.scores!.halftime = payload.halftime || fixture.scores!.halftime;
  fixture.scores!.fulltime = payload.fulltime || fixture.scores!.fulltime;
  fixture.scores!.extratime = payload.extratime || fixture.scores!.extratime;
  fixture.scores!.penalty = payload.penalty || fixture.scores!.penalty;

  return fixture.save();
};

const viewAll = async () => {
  return FixtureModel.find({ isDeleted: false });
};

const viewCompleted = async () => {
  return FixtureModel.find({ status: 'completed' });
};

export { add, remove, edit, viewAll, viewCompleted };
