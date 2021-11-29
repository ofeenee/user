import validator from 'validator';
const {isEmail} = validator;

function validateEmailAddress(string) {
  try {
    if (typeof string !== 'string' || !string) return false;
    else return isEmail(string);
  }
  catch (error) {

  }
}

import dotenv from 'dotenv';
dotenv.config();

const {
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWILIO_SERVICE_SID: serviceSid
} = process.env;

import twilio from 'twilio';
const client = twilio(accountSid, authToken);

function Email(email = null) {
  try {
    if (!new.target) return new Email(email);

    if (email) {
      const valid = validateEmailAddress(email);
      if (!valid) throw new Error('Invalid email address');
    }


    return Object.defineProperties(this, {
      email: {
        value: validateEmailAddress(email) ? email : null,
        configurable: true
      },
      set: {
        value: (string) => {
          try {
            string = string?.trim()?.toLowerCase();
            if (!validateEmailAddress(string)) {
              throw new Error('email value is invalid.');
            }
            else if (string === this.email) {
              return this.email;
            }
            else {
              Object.defineProperty(this, 'email', {
                value: string,
                configurable: true
              });
              return this.email;
            }

          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      get: {
        value: () => {
          if (this.email) return this.email;
          else return null;
        },
        enumerable: true
      },
      verification: {
        value: Object.defineProperties({}, {
          sendCode: {
            value: async () => {
              try {
                if (!this.email) throw new Error('email is not yet set.');

                const verification = await client.verify.services(serviceSid)
                  .verifications
                  .create({ to: this.email, channel: 'email' });

                return verification;

              }
              catch (error) {
                throw error;
              }
            },
            enumerable: true
          },
          confirmCode: {
            value: async (code) => {
              try {
                if (!code) throw new Error('value is invalid.');

                const verification = await client.verify.services(serviceSid)
                  .verificationChecks
                  .create({ to: this.email, code });

                return verification;
              }
              catch (error) {
                throw error;
              }
            },
            enumerable: true
          }
        }),
        enumerable: true
      },
    });
  }
  catch (error) {
    throw error;
  }
}

Object.defineProperty(Email, 'validate', {
  value: validateEmailAddress,
  enumerable: true
});

export default Email;