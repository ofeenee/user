"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const { isEmail } = validator_1.default;
function validateEmailAddress(string) {
    try {
        if (typeof string !== 'string' || !string)
            return false;
        else
            return isEmail(string);
    }
    catch (error) {
        return false;
    }
}
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { TWILIO_ACCOUNT_SID_EMAIL: accountSid, TWILIO_AUTH_TOKEN_EMAIL: authToken, TWILIO_SERVICE_SID_EMAIL: serviceSid } = process.env;
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(accountSid, authToken);
function Email(email) {
    try {
        if (!new.target)
            return new Email(email);
        if (email) {
            const valid = validateEmailAddress(email);
            if (!valid)
                throw new Error('Invalid email address');
        }
        return Object.defineProperties(this, {
            email: {
                value: validateEmailAddress(email) ? email : null,
                configurable: true
            },
            set: {
                value: (string) => {
                    var _a;
                    try {
                        string = (_a = string === null || string === void 0 ? void 0 : string.trim()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
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
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            get: {
                value: () => {
                    if (this.email)
                        return this.email;
                    else
                        return null;
                },
                enumerable: true
            },
            verification: {
                value: Object.defineProperties({}, {
                    sendCode: {
                        value: async () => {
                            try {
                                if (!this.email)
                                    throw new Error('email is not yet set.');
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
                                if (!code)
                                    throw new Error('value is invalid.');
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
exports.default = Email;
