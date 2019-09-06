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

export const validateFixtureUpdate = (requestBody: any) => {
  const fixtureSchema = {
    date: Joi.string().trim(),
    goalsHomeTeam: Joi.number(),
    goalsAwayTeam: Joi.number(),
    time: Joi.string().trim(),
    status: Joi.string().trim(),
    elapsed: Joi.number(),
    home: Joi.string().trim(),
    away: Joi.string().trim(),
    venue: Joi.string().trim(),
    halftime: Joi.string().trim(),
    fulltime: Joi.string().trim(),
    extratime: Joi.string().trim(),
    penalty: Joi.string().trim(),
  };

  const { error, value } = Joi.validate(requestBody, fixtureSchema, {
    abortEarly: false,
  });

  return { error, value };
};
