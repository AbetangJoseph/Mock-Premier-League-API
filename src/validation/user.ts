import Joi from '@hapi/joi';

export const validateSignup = (requestBody: any) => {
  const userSchema = {
    username: Joi.string().required(),
    email: Joi.string()
      .email()
      .lowercase()
      .required(),
    password: Joi.string()
      .min(5)
      .alphanum()
      .required(),
    isAdmin: Joi.boolean(),
  };

  const { error, value } = Joi.validate(requestBody, userSchema, {
    abortEarly: false,
  });

  return { error, value };
};
