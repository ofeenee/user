import dotenv from 'dotenv';
dotenv.config();

import {typePhone} from '../../../User';

import validator from 'validator';
const { isMobilePhone } = validator;

function validatePhone(string:string):boolean {
  try {
    if (typeof string !== 'string' || !string) return false;
    return isMobilePhone(string, 'any', { strictMode: true });
  }
  catch (error) {
    return false
  }
}


// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       GITHUB_AUTH_TOKEN: string;
//       NODE_ENV: 'development' | 'production';
//       PORT?: string;
//       PWD: string;
//       TWILIO_ACCOUNT_SID_PHONE?: string,
//       TWILIO_AUTH_TOKEN_PHONE?: string,
//       TWILIO_SERVICE_SID_PHONE?: string
//     }
//   }
// }


declare const process: {
  env: {
    TWILIO_ACCOUNT_SID_PHONE: string,
    TWILIO_AUTH_TOKEN_PHONE: string,
    TWILIO_SERVICE_SID_PHONE: string;
  }
};

const {
  TWILIO_ACCOUNT_SID_PHONE: accountSid,
  TWILIO_AUTH_TOKEN_PHONE: authToken,
  TWILIO_SERVICE_SID_PHONE: serviceSid
} = process.env;



import twilio from 'twilio';
const client = twilio(accountSid, authToken);



const Phone:typePhone.Interface = function Phone(phone:string): typePhone.Instance {
  try {
      const valid = validatePhone(phone);
      if (!valid) throw new Error('Invalid phone number');

    return Object.create(null, {
      phone: {
        value: phone,
        configurable: true
      },
      set: {
        value: function setPhone(string:string):void {
          try {
            if (!validatePhone(string)) {
              throw new Error('phone value is invalid.');
            }
            else if (string === this.phone) {
              return this.phone;
            }
            else {

              Object.defineProperty(this, 'phone', {
                value: string,
                configurable: true
              });

              return this.phone;
            }

          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      get: {
        value: function getPhone():string | null {
          if (this.phone) return this.phone;
          else return null;
        },
        enumerable: true
      },
      sendVerificationCodeSMS: {
        value: async function sendSMS():Promise<object> {
          try {
            if (!this.phone) throw new Error('phone is not yet set.');
            const verification = await client.verify.services(serviceSid)
              .verifications
              .create({ to: this.phone, channel: 'sms' });

            return verification;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      sendVerificationCodeCall: {
        value: async function sendCall():Promise<object> {
          try {
            if (!this.phone) throw new Error('phone is not yet set.');

            const verification = await client.verify.services(serviceSid)
              .verifications
              .create({ to: this.phone, channel: 'call' });

            return verification;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      confirmVerificationCode: {
        value: async function(code:string):Promise<object> {
          try {
            if (typeof code !== 'string' || !code) throw new Error('value is invalid.');

            const verification = await client.verify.services(serviceSid)
              .verificationChecks
              .create({ to: this.phone, code });

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

Object.defineProperties(Phone, {
  validate: {
    value: validatePhone,
    enumerable: true
  },
});



export default Phone;