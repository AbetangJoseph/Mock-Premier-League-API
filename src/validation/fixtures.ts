import Joi from '@hapi/joi';

export const validateFixture = (requestBody: any) => {
  const fixtureSchema = {
    home: Joi.string()
      .required()
      .trim(),
    away: Joi.string()
      .required()
      .trim(),
    venue: Joi.string()
      .required()
      .trim(),
    time: Joi.string()
      .required()
      .trim(),
    date: Joi.string()
      .required()
      .trim(),
  };

  const { error, value } = Joi.validate(requestBody, fixtureSchema, {
    abortEarly: false,
  });

  return { error, value };
};
