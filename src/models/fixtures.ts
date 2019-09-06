import { prop, Typegoose, Ref } from 'typegoose';
import { Teams } from './teams';
import shortid from 'shortid';

const productionBaseURL = 'yoursite';
const productionPort = 'yourport';
const productionProtocol = 'https';
const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/v1/fixtures'
    : `${productionProtocol}://${productionBaseURL}:${productionPort}/api/v1/fixtures`;

enum matchStatus {
  pending = 'pending',
  completed = 'completed',
  live = 'live',
  cancelled = 'cancelled',
}

class Score {
  @prop({ trim: true, default: null })
  halftime?: string;

  @prop({ trim: true, default: null })
  fulltime?: string;

  @prop({ trim: true, default: null })
  extratime?: string;

  @prop({ trim: true, default: null })
  penalty?: string;
}

class Fixtures extends Typegoose {
  @prop({ required: true, ref: Teams })
  home!: Ref<Teams>;

  @prop({ required: true, ref: Teams })
  away!: Ref<Teams>;

  @prop({ required: true, trim: true })
  venue!: string;

  @prop({ required: true, trim: true })
  time!: string;

  @prop({ trim: true })
  date!: string;

  @prop({ required: true, default: 0 })
  goalsHomeTeam!: number;

  @prop({ required: true, default: 0 })
  goalsAwayTeam!: number;

  @prop({ default: new Score() })
  scores?: Score;

  @prop({ required: true, default: 'pending', enum: matchStatus })
  status?: matchStatus;

  @prop({ required: true, default: 0 })
  elapsed!: number;

  @prop({ default: () => `${url}/${shortid.generate()}` })
  link?: string;

  @prop({ default: false })
  isDeleted?: boolean;
}

const FixtureModel = new Fixtures().getModelForClass(Fixtures);
export { FixtureModel };
