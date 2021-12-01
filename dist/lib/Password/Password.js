"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.isHash = void 0;
const validator_1 = __importDefault(require("validator"));
const { isStrongPassword } = validator_1.default;
const argon2_1 = require("argon2");
Object.defineProperty(exports, "verifyPassword", { enumerable: true, get: function () { return argon2_1.verify; } });
function Password(hash) {
    try {
        if (new.target === undefined)
            return new Password(hash);
        const comparePassword = async (string) => {
            try {
                if (validatePassword(string)) {
                    const match = await (0, argon2_1.verify)(this.hash, string);
                    return match;
                }
                else
                    return false;
            }
            catch (error) {
                throw error;
            }
        };
        return Object.defineProperties(this, {
            hash: {
                value: isHash(hash) ? hash : null,
                configurable: true
            },
            set: {
                value: async (string) => {
                    try {
                        // if string value is invalid (not strong password)
                        if (!validatePassword(string) && !isHash(string))
                            throw new Error('password value is invalid.');
                        // if value is the same as current
                        if (this.hash && isHash(this.hash)) {
                            if (string === this.hash || await comparePassword(string))
                                return this.hash;
                        }
                        // assign string as is to hash,
                        // or hash plain string then assign it to hash
                        if (isHash(string)) {
                            Object.defineProperty(this, 'hash', {
                                value: string,
                                configurable: true
                            });
                            return this.hash;
                        }
                        else {
                            Object.defineProperty(this, 'hash', {
                                value: await (0, argon2_1.hash)(string),
                                configurable: true
                            });
                            return this.hash;
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
                    try {
                        if (isHash(this.hash))
                            return this.hash;
                        else
                            return null;
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            verify: {
                value: comparePassword,
                enumerable: true
            },
        });
    }
    catch (error) {
        throw error;
    }
}
Object.defineProperties(Password, {
    validate: {
        value: validatePassword,
        enumerable: true
    }
});
exports.default = Password;
// HELPER FUNCTIONS
function validatePassword(string) {
    try {
        if (typeof string !== 'string' || !string)
            return false;
        return isStrongPassword(string);
    }
    catch (error) {
        throw false;
    }
}
function isHash(string) {
    try {
        if (typeof string !== 'string' || !string)
            return false;
        const regex = new RegExp(/^\$argon2i\$v=19\$m=4096,t=3,p=1\$[0-z+/]{22,22}\$[0-z/+]{43,43}$/);
        const test = regex.test(string);
        if (test)
            return true;
        else
            return false;
    }
    catch (error) {
        throw false;
    }
}
exports.isHash = isHash;
