import { assert } from 'chai';


import Password from '../Password.js';
import validator from 'validator';

const validPassword = 'Pa55W0rd!';
const invalidPassword = 'password';
const passwordToTest = process.env.password;


describe('Password.validate():', function () {
    const password = Password();

  it(`validate(${validPassword}) to return true`, function () {
    assert.isTrue(password.validate(validPassword));
  });
  it(`validate(${invalidPassword}) to return false`, function () {
    assert.isFalse(password.validate(invalidPassword));
  });
});

describe(`new Password()`, function () {
  const password = new Password();
  it(`successful instance of the class Password()`, function () {
    assert.instanceOf(password, Password);
  });

  it(`password.get() should return null`, function () {
    const currentPassword = password.get();
    assert.isNull(currentPassword);
    assert.isDefined(currentPassword);
  });

  it(`password.set(${validPassword}) to hash password then set it (successfully)`, async function() {
    try {
      const hash = await password.set(validPassword);
      assert.isDefined(hash);
      assert.isString(hash);
      assert.notEqual(hash, validPassword);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`password.set(${invalidPassword}) to attempt to hash password then set it (throws error)`, async function() {
    try {
      const hash = await password.set(invalidPassword);
      assert.fail(`${invalidPassword} is supposed to throw an error, but it did not.`);

    } catch (error) {
      const match = await password.verify(invalidPassword);
      assert.isFalse(match);

      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'password value is invalid.');
    }
  });
  it(`password.get() should return the hash of ${validPassword}`, async function() {
    try {
      const hash = password.get();
      console.log(await password.verify(validPassword));
      assert.isDefined(hash);

      const match = await password.verify(validPassword);
      assert.isTrue(match);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

if (passwordToTest) {
  describe(`Testing passed password: ${passwordToTest}`, function() {
    const isValid = validator.isStrongPassword(passwordToTest);
    const password = Password();
    it(`Instantiate a successful instance of the class password`, function() {
      assert.instanceOf(password, Password);
    });

    it(`get() should return null`, function() {
      assert.isNull(password.get());
    });

    if(isValid) {
      it(`set(${passwordToTest}) to password instance (valid: successfully)`, async function() {
        try {
          const hash = await password.set(passwordToTest);
          assert.isString(hash);
          assert.notEqual(hash, passwordToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`get() should return hash value of ${passwordToTest}`, async function() {
        try {
          assert.isTrue(await password.verify(passwordToTest));
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`set('Kuwait123!) to update current password (successfully)`, async function(){
        try {
          const hash = await password.set('Kuwait123!');
          assert.isString(hash);
          assert.notEqual(hash, 'Kuwait123!');

          // confirm password has been changed successfully
          const match = await password.verify(passwordToTest);
          assert.isFalse(match);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`set('kuwait123) to update current password (throws error)`, async function() {
        try {
          const hash = await password.set('kuwait123');
          assert.isUndefined(hash);
          assert.fail('set password should have thrown an error, but it did not');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'password value is invalid.');

          const hash = password.get();
          assert.isString(hash);

          const match = await password.verify('kuwait123');
          assert.isFalse(match);
        }
      });

      it(`get() should return hash value of Kuwait123!`, async function() {
        try {
          const hash = password.get();
          assert.isString(hash);

          const match = await password.verify('Kuwait123!');
          assert.isTrue(match);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
    }
    else {
      it(`set(${passwordToTest}) to password instance (invalid: throw error)`, async function() {
        try {
          const hash = await password.set(passwordToTest);
          assert.isUndefined(hash);
          assert.fail('set password should have thrown an error, but it did not');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'password value is invalid.');
        }
      });

      it(`get() should return null (password was not set)`, function () {
        assert.isNull(password.get());
      });
    }

  });
}