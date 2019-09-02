import bcrypt from 'bcrypt';

export const comparePassword = async (
  incomingUser: { password: string },
  existingUser: { password: string },
): Promise<boolean> => {
  const validPassword = await bcrypt.compare(
    incomingUser.password,
    existingUser.password,
  );

  return validPassword;
};
