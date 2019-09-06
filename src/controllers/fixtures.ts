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

export { add };
