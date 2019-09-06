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

const remove = async (teamId: string) => {
  const fixture = await FixtureModel.findOne({ _id: teamId });
  if (!fixture || fixture.isDeleted) {
    throw new Error('no such fixture');
  }
  fixture.isDeleted = true;

  const res = await fixture.save();
  return res.id;
};

export { add, remove };
