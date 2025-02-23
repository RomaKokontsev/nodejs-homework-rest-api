const Joi = require('joi');
const {
  HttpCode,
  Subscription,
  Status,
} = require('../../../helpers/constants');

const schemaCreateUser = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/\S+@\S+\.\S+/)
    .required(),
  password: Joi.string().required(),
});

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string().valid(
    Subscription.FREE,
    Subscription.PREMIUM,
    Subscription.PRO,
  ),
});

function validate(schema, obj, next) {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field ${message.replace(/"/g, '')}`,
    });
  }
  next();
}

module.exports.createUser = (req, _res, next) => {
  return validate(schemaCreateUser, req.body, next);
};

module.exports.updateSubscription = (req, _res, next) => {
  return validate(schemaUpdateSubscription, req.body, next);
};
module.exports.updateAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: Status.ERROR,
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'File not found',
    });
  }
  next();
};
