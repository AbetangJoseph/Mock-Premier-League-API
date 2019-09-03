import Joi from '@hapi/joi';

export const validateTeam = (requestBody: any) => {
  const teamSchema = {
    clubName: Joi.string().required(),
    clubCodeName: Joi.string()
      .length(3)
      .uppercase()
      .required(),
    founded: Joi.number()
      .integer()
      .max(9999)
      .required(),
    coach: Joi.string().required(),
    logo: Joi.string(),
    country: Joi.string().required(),
    stadium: Joi.string().required(),
    stadiumCapacity: Joi.number()
      .integer()
      .required(),
  };

  const { error, value } = Joi.validate(requestBody, teamSchema, {
    abortEarly: false,
  });

  return { error, value };
};
