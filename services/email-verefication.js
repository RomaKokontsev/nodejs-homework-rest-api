const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

class EmailService {
  #sender = sgMail;
  #TplGenerator = Mailgen;
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;
      case 'stage':
        this.link = 'https://phonebook-stage.heroku.com';
        break;
      case 'production':
        this.link = 'https://phonebook.heroku.com';
        break;
      default:
        this.link = 'http://localhost:3000';
        break;
    }
  }

  #createVerificationTpl(verificationToken, name = 'Guest') {
    const mailGenerator = new this.#TplGenerator({
      theme: 'cerberus',
      product: {
        name: 'Phonebook app',
        link: this.link,
      },
    });
    const template = {
      body: {
        name,
        intro: 'Welcome',
        action: {
          instructions:
            'Please click the button below to complete sign up process',
          button: {
            color: '#22BC66',
            text: 'Please confirm your account',
            link: `${this.link}/api/auth/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(template);
  }

  async sendVerificationEmail(verificationToken, email, name) {
    const emailBody = this.#createVerificationTpl(verificationToken, name);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: `${process.env.SENDER_VERIFICATION_EMAIL}`,
      subject: 'Phonebook app: account verification',
      html: emailBody,
    };

    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
