"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = exports.Auth = exports.Role = exports.Phone = exports.Password = exports.Email = exports.ID = void 0;
const ID_1 = __importDefault(require("./lib/ID/ID"));
exports.ID = ID_1.default;
const Email_1 = __importDefault(require("./lib/Email/Email"));
exports.Email = Email_1.default;
const Password_1 = __importDefault(require("./lib/Password/Password"));
exports.Password = Password_1.default;
const Phone_1 = __importDefault(require("./lib/Phone/Phone"));
exports.Phone = Phone_1.default;
const Role_1 = __importDefault(require("./lib/Role/Role"));
exports.Role = Role_1.default;
const Authenticator_1 = __importDefault(require("./lib/Authenticator/Authenticator"));
exports.Auth = Authenticator_1.default;
const JWT_1 = __importDefault(require("./lib/JWT/JWT"));
exports.JWT = JWT_1.default;
;
function User({ id, email, password, phone, role }) {
    try {
        const ROLES = ['admin', 'vip', 'premium', 'member', 'basic'];
        Object.freeze(ROLES);
        if (new.target === undefined)
            return new User({ id, email, password, phone, role });
        Object.defineProperties(this, {
            id: {
                value: new ID_1.default(id),
                enumerable: true
            },
            email: {
                value: new Email_1.default(email),
                enumerable: true
            },
            password: {
                value: new Password_1.default(password),
                enumerable: true
            },
            phone: {
                value: new Phone_1.default(phone),
                enumerable: true
            },
            role: {
                value: new Role_1.default(role),
                enumerable: true
            },
            init: {
                value: ({ id, email, password, phone, role, created_at, updated_at }) => {
                    try {
                        if (id)
                            this.id.set(id);
                        if (email)
                            this.email.set(email);
                        else
                            throw new Error('email required.');
                        if (password)
                            this.password.set(password);
                        else
                            throw new Error('password required.');
                        if (phone)
                            this.phone.set(phone);
                        else
                            throw new Error('phone required.');
                        if (role)
                            this.role.set(role);
                        return true;
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            info: {
                value: () => {
                    try {
                        const id = this.id.get();
                        const email = this.email.get();
                        const password = this.password.get();
                        const phone = this.phone.get();
                        const role = this.role.get();
                        return { id, email, password, phone, role };
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
Object.defineProperty(User, 'validate', {
    value: Object.create(null, {
        id: {
            value: ID_1.default.validate,
            enumerable: true
        },
        email: {
            value: Email_1.default.validate,
            enumerable: true
        },
        phone: {
            value: Phone_1.default.validate,
            enumerable: true
        },
        password: {
            value: Password_1.default.validate,
            enumerable: true
        }
    }),
    enumerable: true
});
exports.default = User;
// const auth = new Auth({ id: '853069f6-5da6-4ba8-9690-2bd99828142e', email: 'yousif@almudhaf.com', phone: '+96555968743'});
// const factor = await auth.get('YF0261a4615035d337669c92202f795515');
// console.log(factor);
// const verify = await auth.verify('3393742');
// console.log(verify);
// const authenticate = await auth.authenticate('6239422');g
// console.log(authenticate);
// const attempts = await auth.listAttempts();
// console.log(attempts);
// const result = await auth.delete();
// console.log(result);
const user = new User({ id: '6f56b969-3d22-4c73-8fc5-51145fea882e', email: 'yousif@almudhaf.com', phone: '+96555968743', password: '12345678' });
// console.log(user)
// console.log(user.info())
// console.log(user.role.set('admin'))
// console.log(user.info())
// console.log(user.phone.set('+96555968742'))
// console.log(user.info())
