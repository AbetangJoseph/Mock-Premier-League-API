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
export { add, remove };