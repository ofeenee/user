import ID from './lib/ID/ID';
import Email from './lib/Email/Email';
import Password from './lib/Password/Password';
import Phone from './lib/Phone/Phone';
import Role from './lib/Role/Role';
import Auth from './lib/Authenticator/Authenticator';
import JWT from './lib/JWT/JWT';


// TODO: create an imbedded cache DB for managing users.

interface userInfo {
  id: string;
  email: string;
  password: string;
  phone: string;
  role: string;
};
interface userInit {
  id: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}



function User(this: object, {id, email, password, phone, role}:userInfo) {
  try {
    const ROLES = ['admin', 'vip', 'premium', 'member', 'basic'];
    Object.freeze(ROLES);

    if (new.target === undefined) return new User({id, email, password, phone, role});

    Object.defineProperties(this, {
      id: {
        value: new ID(id),
        enumerable: true
      },
      email: {
        value: new Email(email),
        enumerable: true
      },
      password: {
        value: new Password(password),
        enumerable: true
      },
      phone: {
        value: new Phone(phone),
        enumerable: true
      },
      role: {
        value: new Role(role),
        enumerable: true
      },
      init: {
        value: ({id, email, password, phone, role, created_at, updated_at}:userInit) => {
          try {
            if (id) this.id.set(id);

            if (email) this.email.set(email);
            else throw new Error('email required.');

            if (password) this.password.set(password);
            else throw new Error('password required.');

            if (phone) this.phone.set(phone);
            else throw new Error('phone required.');

            if (role) this.role.set(role);


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

            return {id, email, password, phone, role};
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
        value: ID.validate,
        enumerable: true
      },
      email: {
        value: Email.validate,
        enumerable: true
      },
      phone: {
        value: Phone.validate,
        enumerable: true
      },
      password: {
        value: Password.validate,
        enumerable: true
      }
    }),
    enumerable: true
  });

export default User;
export {ID, Email, Password, Phone, Role, Auth, JWT};

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

const user = new User({ id: '6f56b969-3d22-4c73-8fc5-51145fea882e', email: 'yousif@almudhaf.com', phone: '+96555968743', password: '12345678' })

// console.log(user)
// console.log(user.info())
// console.log(user.role.set('admin'))
// console.log(user.info())
// console.log(user.phone.set('+96555968742'))
// console.log(user.info())
