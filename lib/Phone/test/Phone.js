
import { assert } from 'chai';
import Phone from '../Phone.js';
import validator from 'validator';

const validPhoneNumber = '+96555968743';
const invalidPhoneNumber = '96555968743';
const phoneToTest = process.env.phone;


describe('Phone.validate():', function () {
  const phone = new Phone();
  it(`validate(${validPhoneNumber}) to return true`, function () {
    try {
      assert.isTrue(phone.validate(validPhoneNumber));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
  it(`validate(${invalidPhoneNumber}) to return false`, function () {
    try {
      assert.isFalse(phone.validate(invalidPhoneNumber));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

describe(`new Phone()`, function () {
  const phone = new Phone();
  it(`create successful instance of the class Phone() = "phone"`, function () {
    try {
      assert.instanceOf(phone, Phone);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`phone.get() should return null`, function () {
    try {
      assert.isNull(phone.get());
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`phone.set(${validPhoneNumber}) (valid - successfully)`, function () {
    try {
      assert.equal(phone.set(validPhoneNumber), validPhoneNumber);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`phone.set(${invalidPhoneNumber}) (invalid - throws error)`, function () {
    try {
      phone.set(invalidPhoneNumber);
      assert.fail('phone value is invalid, therefore should have thrown an error.');
    } catch (error) {
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'phone value is invalid.');
    }
  });

  it(`phone.get() should return ${validPhoneNumber}`, function () {
    try {
      assert.strictEqual(phone.get(), validPhoneNumber);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

if (phoneToTest) {
  describe(`Testing passed phone address: ${phoneToTest}`, function () {
    const phone = new Phone();
    const validatePhone = validator.isMobilePhone(phoneToTest, 'any', {strictMode: true});


    // check to see if phone is an instance of the class Phone
    it(`new Phone()`, function () {
      try {
        assert.instanceOf(phone, Phone);
      }
      catch (error) {
        assert.fail(error.message);
      }
    });

    if (validatePhone) {
      // test validate() static method on Phone
      it(`validate(${phoneToTest}) to return true`, function () {
        try {
          const valid = phone.validate(phoneToTest);
          assert.isTrue(valid);
          assert.strictEqual(valid, validatePhone);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      it(`phone.get() should return null`, function () {
        try {
          assert.isNull(phone.get());
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      // try to set the address value to the Phone instance
      it(`phone.set(${phoneToTest})`, function () {
        try {
          assert.strictEqual(phone.set(phoneToTest), phoneToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      // try to get the address value from the instance phone
      it(`phone.get() property should return ${phoneToTest}`, function () {
        try {
          assert.strictEqual(phone.get(), phoneToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      if (process.env.code) {
        it(`confirm verification phone to ${phoneToTest} (invalid)`, async function () {
          try {
            const verification = await phone.verification.confirmCode('123456');
            assert.isDefined(verification);
            assert.strictEqual(verification.status, 'pending');
            assert.strictEqual(verification.to, phone.get());
            assert.isFalse(verification.valid);

          } catch (error) {
            assert.fail(error.message);
          }
        }).timeout(10000);
        it(`confirm verification phone to ${phoneToTest}`, async function () {
          try {
            const verification = await phone.verification.confirmCode(process.env.code);
            assert.isDefined(verification);
            assert.strictEqual(verification.status, 'approved');
            assert.strictEqual(verification.to, phone.get());
            assert.isTrue(verification.valid);

          } catch (error) {
            assert.fail(error.message);
          }
        }).timeout(10000);
      }
      else {
        it(`phone.verification.sendCodeSMS() to ${phoneToTest}`, async function () {
          try {
            const verification = await phone.verification.sendCodeSMS();

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
            assert.strictEqual(verification.to, phone.get());
            assert.isFalse(verification.valid);

          } catch (error) {
            assert.fail(error.message);
          }
        }).timeout(10000);
      }

      it(`phone.set(${validPhoneNumber}) to update (successfully)`, function () {
        try {
          assert.strictEqual(phone.set(validPhoneNumber), validPhoneNumber);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`phone.set(${invalidPhoneNumber}) to update (throws error)`, function () {
        try {
          phone.set(invalidPhoneNumber);
          assert.fail('phone value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'phone value is invalid.');
        }
      });

      it(`phone.get() should return ${validPhoneNumber} (last valid assignment)`, function () {
        try {
          assert.strictEqual(phone.get(), validPhoneNumber);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

    }
    else {
      it(`validate(${phoneToTest}) to return false (invalid)`, function () {
        try {
          assert.isFalse(phone.validate(phoneToTest));
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`phone.set(${phoneToTest}) should fail and throw an error (invalid)`, function () {
        try {
          phone.set(phoneToTest);
          assert.fail('phone value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'phone value is invalid.');
        }
      });

      it(`phone.get() property should return null`, function () {
        assert.isNull(phone.get());
      });
    }
  });
}