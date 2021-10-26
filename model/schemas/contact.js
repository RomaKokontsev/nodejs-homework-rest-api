const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { ContactType } = require('../../helpers/constants');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for your contact'],
    },
    email: {
      type: String,
      required: [true, 'Set email for your contact'],
      unique: true,
    },
    phone: {
      type: Number,
      required: [true, 'Set phone for your contact'],
    },
    category: {
      type: String,
      enum: {
        values: [ContactType.FRIEND, ContactType.WORK, ContactType.OTHER],
        message: "This category doesn't exist",
      },
      default: ContactType.OTHER,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
contactSchema.plugin(mongoosePaginate);

const Contact = model('contact', contactSchema);

module.exports = Contact;
