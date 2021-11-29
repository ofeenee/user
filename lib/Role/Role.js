
const ROLES = ['admin', 'moderator', 'vip', 'premium', 'member', 'basic'];

function Role(role = null) {
  try {
    if (new.target === undefined) return new Role(role);

    Object.freeze(ROLES);

    // HELPER FUNCTIONS
    function validateRole(string) {
      try {
        if (typeof string === 'string' && string)
          return ROLES.includes(string);
        else return false;
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
          try {
            string = string?.trim()?.toLowerCase();

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
          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      get: {
        value: () => {
          if (this.role) return this.role;
          else return null;
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

export default Role;