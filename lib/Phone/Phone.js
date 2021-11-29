import validator from 'validator';
const { isMobilePhone } = validator;

function validatePhone(string) {
  try {
    if (typeof string !== 'string' || !string) return false;
    return isMobilePhone(string, 'any', { strictMode: true });
  }
  catch (error) {
    throw error;
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

function Phone(phone = null) {
  try {
    if (new.target === undefined) return new Phone(phone);

    if (phone) {
      const valid = validatePhone(phone);
      if (!valid) throw new Error('Invalid phone number');
    }

    return Object.defineProperties(this, {
      phone: {
        value: validatePhone(phone) ? phone : null,
        configurable: true
      },
      set: {
        value: (string) => {
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
        value: () => {
          if (this.phone) return this.phone;
          else return null;
        },
        enumerable: true
      },
      verification: {
        value: Object.defineProperties({}, {
          sendCodeSMS: {
            value: async () => {
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
          sendCodeCall: {
            value: async () => {
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
          confirmCode: {
            value: async (code) => {
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
        })
      },
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