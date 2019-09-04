import { prop, Typegoose } from 'typegoose';

class Teams extends Typegoose {
  @prop({ required: true, trim: true })
  clubName!: string;

  @prop({ required: true, trim: true })
  clubCodeName!: string;

  @prop({ required: true })
  founded!: number;

  @prop({ required: true, trim: true })
  coach!: string;

  @prop({ trim: true, default: 'logo' })
  logo?: string;

  @prop({ required: true, trim: true })
  country!: string;

  @prop({ required: true, trim: true })
  stadium!: string;

  @prop({ required: true })
  stadiumCapacity!: number;

  @prop({ default: false })
  isDeleted?: boolean;
}

const TeamModel = new Teams().getModelForClass(Teams);
export { TeamModel };
