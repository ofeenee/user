import ID from './lib/ID/ID.js';
import Email from './lib/Email/Email.js';
// import Password from './lib/Password/Password.js';
import Phone from './lib/Phone/Phone.js';
// import Role from './lib/Role/Role.js';
import Auth from './lib/Authenticator/Authenticator.js';
import JWT from './lib/JWT/JWT.js';
import { User } from '../User.js';


// TODO: create an imbedded cache DB for managing users.




const User:User.Interface = function User(this: any, {id, email, phone}:User.credentials):User.Instance {
  try {
    const ROLES = ['admin', 'vip', 'premium', 'member', 'basic'];
    Object.freeze(ROLES);

    const newUser = Object.create(null, {
      id: {
        value: ID(id || ID.generate()),
        enumerable: true
      },
      email: {
        value: Email(email),
        enumerable: true
      },
      phone: {
        value: Phone(phone),
        enumerable: true
      },
      auth: {
        value: function() {
          try {
            Object.defineProperty(this, 'auth', {
              value: Auth(this.info()),
              enumerable: true,
              configurable: false,
            })
          }
          catch (error) {
            console.log(error);

          }
        },
        enumerable: true,
        configurable: true
      },
      // init: {
      //   value: ({id, email, phone, created_at, updated_at}:User.credentials) => {
      //     try {

      //       if (id) this.id.set(id);

      //       if (email) this.email.set(email);
      //       else throw new Error('email required.');

      //       if (phone) this.phone.set(phone);
      //       else throw new Error('phone required.');

      //       return true;
      //     }
      //     catch (error) {
      //       throw error;
      //     }
      //   },
      //   enumerable: true
      // },
      info: {
        value: function getUserInfo() {
          try {
            const id = this.id.get();
            const email = this.email.get();
            const phone = this.phone.get();

            return {id, email, phone};
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
    });

    return newUser

  }
  catch (error) {
    throw error;
  }
}


export default User;
export {ID, Email, Phone, Auth, JWT};

const user = User({ id: '2b7ed861-830e-4209-a4db-583e87d3fcc4', email: 'yousif@almudhaf.com', phone: '+96555968743'});
console.log(user);
user.auth();

console.log(user);
user.auth.get('YF0261a760302a7b7d8dd53026c9877450').then(function(response) {

  console.log(response);

  return user.auth.verify('320696');
})
.catch(function(error) {
  console.log(error);
});