import { TeamModel } from '../models/teams';

const add = async (newTeam: any) => {
  const team = new TeamModel(newTeam);

  const existingTeam = await TeamModel.findOne({ clubName: team.clubName });

  if (!existingTeam) {
    return team.save();
  }
  throw new Error('team already exists');
};

export { add };
