import { signup, login } from '../../src/controllers/user';
import { DBdisconnect, DBconnect } from '../../testConfig/db';

describe('TESTS FOR USER CONTROLLER', () => {
  beforeAll(async () => {
    await DBconnect();
  });

  afterAll(async () => {
    await DBdisconnect();
  });

  describe('Signup Controller', () => {
    const user = {
      username: 'joe',
      email: 'joeabetang@gmail.com',
      password: 'pass1234',
      isAdmin: true,
    };

    it('checks that user was created has an id property', async () => {
      const result = await signup(user);
      expect(result).toHaveProperty('_id');
    });

    it('throws error on attempt to signup using an existing email address', async () => {
      try {
        const result = await signup(user);
        expect(result).toThrowError('user already exists');
      } catch (error) {}
    });
  });

  describe('Login Controller', () => {
    const userWithRightCredentials = {
      email: 'joeabetang@gmail.com',
      password: 'pass1234',
    };

    const userWithWrongCredentials = {
      email: 'joeabetang@gmail.com',
      password: 'pass123',
    };

    const userWithWrongCredentials2 = {
      email: 'abetang@gmail.com',
      password: 'pass123',
    };

    it('returns a jwt token if login is successful', async () => {
      const result = await login(userWithRightCredentials);
      expect(result).toHaveProperty('token');
    });

    it('throws error if either password or email is incorrect', async () => {
      try {
        await login(userWithWrongCredentials);
      } catch (err) {
        expect(err).toEqual(new Error('Invalid email or password'));
      }
    });

    it('throws error if user doest not exist', async () => {
      try {
        await login(userWithWrongCredentials2);
      } catch (err) {
        expect(err).toEqual(new Error('Invalid email or password'));
      }
    });
  });
});
