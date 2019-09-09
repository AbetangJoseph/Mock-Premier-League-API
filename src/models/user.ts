import { prop, Typegoose, instanceMethod, InstanceType, pre } from 'typegoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

@pre<Users>('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})
class Users extends Typegoose {
  @prop({ required: true, trim: true })
  username!: string;

  @prop({ required: true, trim: true, unique: true })
  email!: string;

  @prop({ required: true, trim: true })
  password!: string;

  @prop({ default: false })
  isAdmin!: boolean;

  @instanceMethod
  public generateAuthToken(this: InstanceType<Users>) {
    const token = jwt.sign(
      { isAdmin: this.isAdmin, username: this.username, _id: this.id },
      `${process.env.JWT_SECRET}`,
      { expiresIn: '1d', issuer: 'STERLING' },
    );
    return token;
  }
}

const UserModel = new Users().getModelForClass(Users);

export { UserModel };
