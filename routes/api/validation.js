const Joi = require('joi');
const { HttpCode, ContactType } = require('../../../helpers/constants');

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email()
    .pattern(/\S+@\S+\.\S+/)
    .required(),
  phone: Joi.number().required(),
  category: Joi.string().valid(
    ContactType.OTHER,
    ContactType.FRIEND,
    ContactType.WORK,
  ),
});

const schemaUpdateContactField = Joi.alternatives().try(
  Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email(),
    phone: Joi.number(),
    category: Joi.string().valid(
      ContactType.OTHER,
      ContactType.FRIEND,
      ContactType.WORK,
    ),
  }),

  Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email().required(),
    phone: Joi.number(),
    category: Joi.string().valid(
      ContactType.OTHER,
      ContactType.FRIEND,
      ContactType.WORK,
    ),
  }),

  Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.number().required(),
    category: Joi.string()
      .valid(ContactType.OTHER, ContactType.FRIEND, ContactType.WORK)
      .required(),
  }),
);

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.createContact = (req, _res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

module.exports.updateContactField = (req, _res, next) => {
  return validate(schemaUpdateContactField, req.body, next);
};
