import { UserModel } from '../models/user';

const users = [
  new UserModel({
    _id: '5d4155cfcd68f4086d8df490',
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'password',
    isAdmin: true,
  }),

  new UserModel({
    _id: '5d4155cfcd68f4086d8df491',
    username: 'user',
    email: 'user@gmail.com',
    password: 'password',
    isAdmin: false,
  }),
];

export default users;
