import { assert } from 'chai';
import ID from '../ID.js';

import validator from 'validator';
const {isUUID} = validator;

const validID = 'b3e23008-35d7-472b-bd30-b006f9b9fa40';
const invalidID = 'b3e23008-35s7-472b-bd30-b006f9b9fa40'; // 35(s)7 the invalid part
const idToTest = process.env.uuid;

describe('new ID()', function () {
  const id = ID(); // with new or without work the same
  it(`new instance of ID()`, function() {
    try {
      assert.instanceOf(id, ID);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`id.validate(${validID}) should return true`, function() {
    try {
      assert.isTrue(id.validate(validID));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`id.validate(${invalidID}) should return false`, function() {
    try {
      assert.isFalse(id.validate(invalidID));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`id.get() should return null`, function() {
    try {
      const uuidv4 = id.get();
      assert.isDefined(uuidv4);
      assert.isNull(uuidv4);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`id.generate() a new random UUID v4`, function() {
    try {
      const uuidv4 = id.generate();
      id.set(uuidv4);
      assert.isString(uuidv4);
      assert.isTrue(isUUID(uuidv4));
      assert.strictEqual(uuidv4, id.get());
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`id.set(${validID}) to id instance (successfully)`, function() {
    try {
      id.set(validID);
      const uuidv4 = id.get();
      assert.isString(uuidv4);
      assert.isTrue(isUUID(uuidv4));
      assert.strictEqual(uuidv4, validID);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
  it(`id.set(${invalidID}) should throw an error (invalid UUID)`, function() {
    try {
      id.set(invalidID);
      assert.fail('should throw an error, seeing this proves otherwise.');
    }
    catch (error) {
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'ID value is invalid.');
    }
  });

  it(`get() should return last valid assigned UUID (${validID})`, function() {
    try {
      const uuidv4 = id.get();
      assert.isString(uuidv4);
      assert.isTrue(isUUID(uuidv4));
      assert.strictEqual(uuidv4, validID);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});


if (idToTest) {
  const id = ID();
  const valid = isUUID(idToTest);
  if (valid) {
    describe(`testing the passed UUID: ${idToTest} (valid)`, function () {
      // if the passed UUID is valid:
      it(`id.validate(${idToTest}) should return true`, function () {
        try {
          const isValid = id.validate(idToTest);
          assert.isTrue(isValid);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`check id to be an ID instance`, function () {
        try {
          assert.instanceOf(id, ID);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`id.get() should return null`, function () {
        try {
          const uuidv4 = id.get();
          assert.isDefined(uuidv4);
          assert.isNull(uuidv4);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`id.set(${idToTest}) to assign passed id (successfully)`, function () {
        try {
          const uuidv4 = id.set(idToTest);
          assert.isString(uuidv4);
          assert.isTrue(isUUID(uuidv4));
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`id.get() should return (${idToTest})`, function () {
        try {
          const uuidv4 = id.get();
          assert.isString(uuidv4);
          assert.strictEqual(uuidv4, idToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`id.set(${invalidID}) to assign invalid UUID (throw error)`, function () {
        try {
          const uuidv4 = id.set(invalidID);
          assert.fail('should throw an error, and this message proves otherwise');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'ID value is invalid.');
        }
      });

      it(`id.get() should still return (${idToTest})`, function () {
        try {
          const uuidv4 = id.get();
          assert.isString(uuidv4);
          assert.strictEqual(uuidv4, idToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
    });
  }
  else {
    describe(`testing the passed UUID: ${idToTest} (invalid)`, function () {
      it(`check id to be an ID instance`, function () {
        try {
          assert.instanceOf(id, ID);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`id.get() should return null`, function () {
        try {
          const uuidv4 = id.get();
          assert.isDefined(uuidv4);
          assert.isNull(uuidv4);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`id.set(${idToTest}) to assign passed id (throw error)`, function () {
        try {
          const uuidv4 = id.set(idToTest);
          assert.fail('should throw an error, and this message proves otherwise.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'ID value is invalid.');
        }
      });

      it(`id.get() should still return null`, function () {
        try {
          const uuidv4 = id.get();
          assert.isDefined(uuidv4);
          assert.isNull(uuidv4);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
    });
  }
}
