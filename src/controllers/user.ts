import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';

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

export { signup };
