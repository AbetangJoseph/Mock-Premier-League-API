import { TeamModel } from '../models/teams';

const add = async (newTeam: any) => {
  const team = new TeamModel(newTeam);

  const existingTeam = await TeamModel.findOne({ clubName: team.clubName });

  if (!existingTeam) {
    return team.save();
  }
  throw new Error('team already exists');
};

const remove = async (teamId: string) => {
  const team = await TeamModel.findOne({ _id: teamId });
  if (!team || team.isDeleted) {
    throw new Error('no such team');
  }
  team.isDeleted = true;

  const res = await team.save();
  return res.id;
};

const edit = async (teamId: string, payload: any) => {
  let team = await TeamModel.findOne({ _id: teamId });
  if (!team || team.isDeleted) {
    throw new Error('no such team');
  }

  team.clubName = payload.clubName || team.clubName;
  team.clubCodeName = payload.clubCodeName || team.clubCodeName;
  team.founded = payload.founded || team.founded;
  team.coach = payload.coach || team.coach;
  team.country = payload.country || team.country;
  team.stadium = payload.stadium || team.stadium;
  team.stadiumCapacity = payload.stadiumCapacity || team.stadiumCapacity;

  return team.save();
};

const viewAll = async () => {
  return TeamModel.find({ isDeleted: false });
};

const searchTeam = async (searchParam: any) => {
  const key = Object.keys(searchParam)[0];
  const value = Object.values(searchParam)[0];

  if (key === 'founded' || key === 'stadiumCapacity') {
    throw new Error(
      'please you cannot search by founded or stadiumCapacity yet',
    );
  }

  const team = await TeamModel.find({
    [key]: { $regex: new RegExp(`${value}`), $options: 'i' },
    isDeleted: false,
  });

  if (!team.length) {
    throw new Error('no match found');
  }

  return team;
};

export { add, remove, edit, viewAll, searchTeam };
