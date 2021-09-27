import {assert} from 'chai';
import User from '../User.js';
import Email from '@ofeenee/email';
import ID from '@ofeenee/id';
import { genUUID } from '@ofeenee/id';
import Password from '@ofeenee/password';
import {isHash, verifyPassword} from '@ofeenee/password';
import Phone from '@ofeenee/phone';

// dotenv.config();

import PDB from '../../postgresDB/PostgresDB.js';
const Postgres = PDB();

// new user credentials
const yousif = {
  id: genUUID(),
  email: 'yousif@almudhaf.com',
  password: 'Nothing123!',
  phone: '+96555968743'
};

// to assure nothing alter the original object
Object.freeze(yousif);


describe(`new User()`, function() {
  const user = new User({
    id: new ID(),
    email: new Email(),
    password: new Password(),
    phone: new Phone(),
  });

  before(function() {

  });

  beforeEach(function (done) {
    setTimeout(done, 250);
  });

  it(`inspect User() instance "user"`, function() {
    try {
      assert.instanceOf(user, User);
      assert.hasAllKeys(user, ['id', 'email', 'password', 'phone', 'role', 'info', 'registration', 'application', 'authentication']);
      assert.instanceOf(user.id, ID);
      assert.instanceOf(user.email, Email);
      assert.instanceOf(user.password, Password);
      assert.instanceOf(user.phone, Phone);
      assert.isNull(user.id.get());
      assert.isNull(user.email.get());
      assert.isNull(user.password.get());
      assert.isNull(user.phone.get());

    }
    catch (error) {
      assert.fail(error);
    }
  });

  it(`Postgres.createSchema() to prepare db and table`, async function() {
    try {
      const tableReady = await Postgres.createSchema();
      // console.log(tableReady);
      assert.isTrue(tableReady.success);
    }
    catch (error) {
      assert.fail(error);
    }
  });

  it(`user.id.set(${yousif.id})`, function() {
    try {
     const value = user.id.set(yousif.id);
     assert.strictEqual(value, yousif.id);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`user.id.get() to return ${yousif.id}`, function() {
    try {
     const value = user.id.get();
     assert.strictEqual(value, yousif.id);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`user.email.set(${yousif.email})`, function() {
    try {
     const value = user.email.set(yousif.email);
     assert.strictEqual(value, yousif.email);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`user.email.get() to return ${yousif.email}`, function() {
    try {
     const value = user.email.get();
     assert.strictEqual(value, yousif.email);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`user.password.set(${yousif.password})`, async function() {
    try {
     const value = await user.password.set(yousif.password);
     assert.isTrue(isHash(value));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`user.password.get() to return a valid hash of ${yousif.password}`, async function() {
    try {
     const value = user.password.get();
     assert.isTrue(isHash(value));
     assert.isTrue(await user.password.verify(yousif.password));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`user.phone.set(${yousif.phone})`, async function() {
    try {
     const value = await user.phone.set(yousif.phone);
     assert.strictEqual(value, yousif.phone);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`user.phone.get() to return ${yousif.phone}`, async function() {
    try {
     const value = user.phone.get();
     assert.strictEqual(value, yousif.phone);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`user.info() to an object with id, email, password, phone`, async function() {
    try {
     const value = user.info();
     assert.hasAllKeys(value, ['id', 'email', 'password', 'phone']);
     assert.strictEqual(value.id, yousif.id);
     assert.strictEqual(value.email, yousif.email);
     assert.isTrue(await verifyPassword(value.password, yousif.password));
     assert.strictEqual(value.phone, yousif.phone);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  after(function(done) {
    console.log('all done.');
    return done();
  });
});