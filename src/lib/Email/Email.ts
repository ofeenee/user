import validator from 'validator';
const {isEmail} = validator;

function validateEmailAddress(string:string):boolean {
  try {
    if (typeof string !== 'string' || !string) return false;
    else return isEmail(string);
  }
  catch (error) {
    return false
  }
}

import dotenv from 'dotenv';
dotenv.config();

declare const process: {
  env: {
    TWILIO_ACCOUNT_SID_EMAIL: string,
    TWILIO_AUTH_TOKEN_EMAIL: string,
    TWILIO_SERVICE_SID_EMAIL: string;
  };
};

const {
  TWILIO_ACCOUNT_SID_EMAIL: accountSid,
  TWILIO_AUTH_TOKEN_EMAIL: authToken,
  TWILIO_SERVICE_SID_EMAIL: serviceSid
} = process.env;

import twilio from 'twilio';
const client = twilio(accountSid, authToken);

interface fnEmail {
  (email:string):any;
  new(email:string):any;
}


function Email(this: any, email:string):any {
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
        value: (string:string) => {
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
            value: async (code:string) => {
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
