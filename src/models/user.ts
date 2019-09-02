import { prop, Typegoose } from 'typegoose';
// import * as mongoose from 'mongoose';

class Users extends Typegoose {
  @prop({ required: true, trim: true })
  username!: string;

  @prop({ required: true, trim: true, unique: true })
  email!: string;

  @prop({ required: true, trim: true })
  password!: string;

  @prop({ default: false })
  isAdmin!: boolean;
}
const UserModel = new Users().getModelForClass(Users);

export { UserModel };
