import {assert} from 'chai';
import Email from '../Email.js';
import validator from 'validator';


const validEmailAddress = 'example@email.com';
const invalidEmailAddress = 'example@emailcom';
const emailToTest = process.env.email;


describe('Email.validate():', function() {
  const email = new Email();
  it(`validate(${validEmailAddress}) to return true`, function() {
    try {
      assert.isTrue(Email.validate(validEmailAddress));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
  it(`validate(${invalidEmailAddress}) to return false`, function() {
    try {
      assert.isFalse(Email.validate(invalidEmailAddress));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

describe(`new Email()`, function() {
  const email = new Email();
  it(`create successful instance of the class Email() = "email"`, function() {
    try {
      assert.instanceOf(email, Email);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`email.get() should return null`, function () {
    try {
        assert.isNull(email.get());
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`email.set(${validEmailAddress}) to the Email instance "email" (successfully)`, function() {
    try {
      assert.equal(email.set(validEmailAddress), validEmailAddress);
      assert.equal(email.get(), validEmailAddress);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`email.set(${invalidEmailAddress}) to the Email instance "email" (throws error)`, function() {
    try {
      email.set(invalidEmailAddress);
      assert.fail('email value is invalid, therefore should have thrown an error. This message proves otherwise.');
    } catch (error) {
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'email value is invalid.');
    }
  });
  it(`email.get should return last valid assigned email (${validEmailAddress})`, function() {
    try {
      assert.strictEqual(email.get(), validEmailAddress);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

if (emailToTest) {
  describe(`Testing passed email address: ${emailToTest}`, function() {
    const email = new Email();
    const validateEmail = validator.isEmail(emailToTest);


    // check to see if email is an instance of the class Email
    it(`new Email()`, function() {
      try {
        assert.instanceOf(email, Email);
      }
      catch (error) {
        assert.fail(error.message);
      }
    });

    if (validateEmail) {
      // test validate() static method on Email
      it(`email.validate(${emailToTest}) to return true`, function() {
        try {
          const valid = email.validate(emailToTest)
          assert.isTrue(valid);
          assert.strictEqual(valid, validateEmail);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      // try to set the address value to the Email instance
      it(`email.set(${emailToTest}) to email instance (successfully)`, function() {
        try {
          assert.strictEqual(email.set(emailToTest), emailToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      // try to get the address value from the instance email
      it(`email.get() should return ${emailToTest}`, function() {
        try {
          assert.strictEqual(email.get(), emailToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });


      if (process.env.code) {
        it(`confirm verification email to ${emailToTest} "invalid code"`, async function() {
          try {
            const verification = await email.verification.confirmCode('123456');
            assert.isDefined(verification);
            assert.strictEqual(verification.status, 'pending');
            assert.strictEqual(verification.to, email.get());
            assert.isFalse(verification.valid);

          } catch(error) {
            assert.fail(error.message);
          }
        }).timeout(10000);

        it(`confirm verification email to ${emailToTest} "valid code"`, async function() {
          try {
            const verification = await email.verification.confirmCode(process.env.code);
            assert.isDefined(verification);
            assert.strictEqual(verification.status, 'approved');
            assert.strictEqual(verification.to, email.get());
            assert.isTrue(verification.valid);

          } catch(error) {
            assert.fail(error.message);
          }
        }).timeout(10000);
      }
      else {
        it(`send verification email to ${emailToTest}`, async function () {
          try {
            const verification = await email.verification.sendCode();

            // const {sid, status, valid, sendCodeAttempts} = verification;
            // console.log({sid, status, valid, sendCodeAttempts});

            assert.isDefined(verification);
            assert.containsAllKeys(verification, [
              'sid',
              'serviceSid',
              'accountSid',
              'to',
              'channel',
              'status',
              'valid',
            ]);
            assert.strictEqual(verification.status, 'pending');
            assert.strictEqual(verification.to, email.get());
            assert.isFalse(verification.valid);

          } catch (error) {
            assert.fail(error.message);
          }
        }).timeout(10000);
      }

      it(`email.set(${validEmailAddress}) to update (successfully)`, function() {
        try {
          assert.strictEqual(email.set(validEmailAddress), validEmailAddress);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`email.set(${invalidEmailAddress}) to update (throws error)`, function() {
        try {
          email.set(invalidEmailAddress);
          assert.fail('email value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'email value is invalid.');
        }
      });

      it(`email.get(${validEmailAddress}) to retrieve last valid email address assigned`, function() {
        try {
          assert.strictEqual(email.get(), validEmailAddress);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

    }
    else {
      it(`email.validate(${emailToTest}) to return false (invalid)`, function() {
        try {
          assert.isFalse(email.validate(emailToTest));
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`email.set(${emailToTest}) should fail and throw an error`, function() {
        try {
          email.set(emailToTest);
          assert.fail('email value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'email value is invalid.');
        }
      });

      it(`email.get() should return null`, function() {
        assert.isNull(email.get());
      });
    }
  });
}