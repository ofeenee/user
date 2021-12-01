import validator from 'validator';
const {isEmail} = validator;

import {Email} from '../../../User.d';

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

const Email: Email.Interface = function Email(this: any, email: string): Email.Instance {
  try {

    const valid = validateEmailAddress(email);
    if (!valid) throw new Error('Invalid email address');


    return Object.create(null, {
      email: {
        value: validateEmailAddress(email) ? email : null,
        configurable: true
      },
      set: {
        value: function setEmail(string:string) {
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
        value: function getEmail() {
          if (this.email) return this.email;
          else return null;
        },
        enumerable: true
      },
      sendVerificationCode: {
        value: async function sendCode(): Promise<object> {
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
      confirmVerificationCode: {
        value: async function confirmCode(code:string):Promise<object> {
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