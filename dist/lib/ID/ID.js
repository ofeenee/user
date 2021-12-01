"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
const uuid_1 = require("uuid");
const validator_1 = __importDefault(require("validator"));
const { isUUID } = validator_1.default;
;
function ID(id) {
    try {
        if (new.target === undefined)
            return new ID(id);
        Object.defineProperties(this, {
            id: {
                value: validateID(id) ? id : null,
                configurable: true
            },
            set: {
                value: (string) => {
                    var _a;
                    try {
                        string = (_a = string === null || string === void 0 ? void 0 : string.trim()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                        if (!validateID(string))
                            throw new Error('ID value is invalid.');
                        else if (this.id !== null)
                            throw new Error('Forbidden. ID has already been set.');
                        else {
                            Object.defineProperty(this, 'id', {
                                value: string,
                                configurable: false
                            });
                            return this.id;
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
                        if (this.id)
                            return this.id;
                        else
                            return null;
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
        });
    }
    catch (error) {
        throw error;
    }
}
Object.defineProperties(ID, {
    validate: {
        value: validateID,
        enumerable: true
    },
    generate: {
        value: generateNewUUIDv4,
        enumerable: true
    }
});
exports.default = ID;
// HELPER FUNCTIONS
function validateID(string) {
    try {
        if (typeof string !== 'string' && !string)
            return false;
        if (isUUID(string))
            return true;
        else
            return false;
    }
    catch (error) {
        return false;
    }
}
function generateNewUUIDv4() {
    try {
        return (0, uuid_1.v4)();
    }
    catch (error) {
        throw error;
    }
}
exports.uuid = generateNewUUIDv4;
