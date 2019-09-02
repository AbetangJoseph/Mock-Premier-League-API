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

export const validateLogin = (input: any) => {
  const userSchema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(25)
      .required(),
  };

  const { error, value } = Joi.validate(input, userSchema, {
    abortEarly: false,
  });
  return { error, value };
};
