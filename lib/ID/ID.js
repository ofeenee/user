import {v4 as uuidv4} from 'uuid';
import validator from 'validator';
const {isUUID} = validator;

function ID(id = null) {
  try {
    if (new.target === undefined) return new ID(id);
    Object.defineProperties(this, {
      id: {
        value: validateID(id) ? id : null,
        configurable: true
      },
      set: {
        value: (string) => {
          try {
            string = string?.trim()?.toLowerCase();

            if (!validateID(string)) throw new Error('ID value is invalid.');
            else if (this.id !== null) throw new Error('Forbidden. ID has already been set.')
            else {
              Object.defineProperty(this, 'id', {
                value: string,
                configurable: false
              });

              return this.id;
            }
          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      get: {
        value: () => {
          try {
            if (this.id) return this.id;
            else return null;
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

export default ID;
export { generateNewUUIDv4 as uuid };


// HELPER FUNCTIONS
function validateID(string) {
  try {
    if (typeof string !== 'string' && !string) return false;
    if (isUUID(string)) return true;
    else return false;
  }
  catch (error) {
    throw error;
  }
}

function generateNewUUIDv4() {
  try {
    return uuidv4();
  }
  catch (error) {
    throw error;
  }
}