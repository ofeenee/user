import {v4 as uuidv4} from 'uuid';
import validator from 'validator';
import { ID } from '../../../User';
const {isUUID} = validator;



const ID:ID.Interface = function theID(this: any, id:string):ID.Instance {
  try {

    const valid = validateID(id);
    if (!valid) throw new Error('Invalid ID');

    const oId:ID.Instance =  Object.create(null, {
      id: {
        value: id,
        configurable: true
      },
      set: {
        value: function setID(string:string) {
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
        value: function getID() {
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

    return oId;

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
function validateID(string:string):boolean {
  try {
    if (typeof string !== 'string' && !string) return false;
    if (isUUID(string)) return true;
    else return false;
  }
  catch (error) {
    return false;
  }
}

function generateNewUUIDv4():string {
  try {
    const uuid:string = uuidv4();
    return uuid;
  }
  catch (error) {
    throw error;
  }
}