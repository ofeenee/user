"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validator_1 = __importDefault(require("validator"));
const { isMobilePhone } = validator_1.default;
function validatePhone(string) {
    try {
        if (typeof string !== 'string' || !string)
            return false;
        return isMobilePhone(string, 'any', { strictMode: true });
    }
    catch (error) {
        return false;
    }
}
const { TWILIO_ACCOUNT_SID_PHONE: accountSid, TWILIO_AUTH_TOKEN_PHONE: authToken, TWILIO_SERVICE_SID_PHONE: serviceSid } = process.env;
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(accountSid, authToken);
function Phone(phone) {
    try {
        if (new.target === undefined)
            return new Phone(phone);
        if (phone) {
            const valid = validatePhone(phone);
            if (!valid)
                throw new Error('Invalid phone number');
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
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            get: {
                value: () => {
                    if (this.phone)
                        return this.phone;
                    else
                        return null;
                },
                enumerable: true
            },
            verification: {
                value: Object.defineProperties({}, {
                    sendCodeSMS: {
                        value: async () => {
                            try {
                                if (!this.phone)
                                    throw new Error('phone is not yet set.');
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
                                if (!this.phone)
                                    throw new Error('phone is not yet set.');
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
                                if (typeof code !== 'string' || !code)
                                    throw new Error('value is invalid.');
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
exports.default = Phone;
