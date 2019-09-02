import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';
import { comparePassword } from '../services/comparePassword';

const signup = async (newUser: any) => {
  const user = new UserModel(newUser);
  const foundUser = await UserModel.findOne({ email: user.email });
  if (!foundUser) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return user.save();
  }
  throw new Error('user already exists');
};

const login = async (incomingUser: any) => {
  const existingUser = await UserModel.findOne({ email: incomingUser.email });
  if (!existingUser) {
    throw new Error('Invalid email or password');
  }

  const validPassword = await comparePassword(incomingUser, existingUser);

  if (!validPassword) {
    throw new Error('Invalid email or password');
  }

  const token = existingUser.generateAuthToken();
  return { token };
};

export { signup, login };
