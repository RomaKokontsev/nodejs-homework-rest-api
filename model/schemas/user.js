const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const { Subscription } = require('../../helpers/constants');

const SALT_WORK_FACTOR = 8;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Set email for a user'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Set password for a user'],
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true);
      },
    },
    subscription: {
      type: String,
      enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
      default: Subscription.FREE,
    },

    token: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verification token required'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
