import ID from '@ofeenee/id';
import Email from "@ofeenee/email";
import Password from "@ofeenee/password";
import Phone from '@ofeenee/phone';
import Role from '@ofeenee/role';


function User({id, email, password, phone, role} = {}) {
  try {
    const ROLES = ['admin', 'vip', 'premium', 'member', 'basic'];
    Object.freeze(ROLES);

    if (new.target === undefined) return new User({id, email, password, phone, role,});

    if (typeof id === 'string' && isUUID(id)) Object.defineProperty(this, 'id', {
      value: id,
      enumerable: true
    });

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
        value: ({id, email, password, phone, role, created_at, updated_at} = {}) => {
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


export default User;


// testing
// const user = new User();
// console.log(user);