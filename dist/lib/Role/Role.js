"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ROLES = ['admin', 'moderator', 'vip', 'premium', 'member', 'basic'];
function Role(role = null) {
    try {
        if (new.target === undefined)
            return new Role(role);
        Object.freeze(ROLES);
        // HELPER FUNCTIONS
        function validateRole(string) {
            try {
                if (typeof string === 'string' && string)
                    return ROLES.includes(string);
                else
                    return false;
            }
            catch (error) {
                throw error;
            }
        }
        // return new instance of Role <role object>
        return Object.defineProperties(this, {
            role: {
                value: validateRole(role) ? role : null,
                configurable: true
            },
            set: {
                value: (string) => {
                    var _a;
                    try {
                        string = (_a = string === null || string === void 0 ? void 0 : string.trim()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                        if (validateRole(string)) {
                            Object.defineProperty(this, 'role', {
                                value: string,
                                configurable: true
                            });
                            return string;
                        }
                        else {
                            throw new Error('role value is invalid.');
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
                    if (this.role)
                        return this.role;
                    else
                        return null;
                },
                enumerable: true
            },
            validate: {
                value: validateRole,
                enumerable: true
            },
        });
    }
    catch (error) {
        throw error;
    }
}
exports.default = Role;
