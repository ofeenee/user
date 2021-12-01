import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import validator from 'validator';
const { isJWT } = validator;
import * as jose from 'jose';
const { SignJWT, jwtVerify, EncryptJWT, jwtDecrypt} = jose;

import {JWT, JWT as typeJWT} from '../../../User';

const JWT:typeJWT.Interface = function newJWT(o?):typeJWT.Instance {
  try {

    // defaults
    const {
        issuer,
        audience,
        expiration,
        encrypted = false,
        subject,
        path = '.secrets'
    } = o ?? { issuer: null, audience: null, expiration: null, encrypted: false, subject: null, path: '.secrets' };



    const secret = Object.create({}, {
        keys: {
          value: setTokens(path) ?? genTokens(path),
          enumerable: true
        },
      });

    const methods = Object.create(null, {

      validateJWT: {
        value: validateJWT,
        enumerable: true
      },
      signJWT: {
        value: async function signToken(payload: any) {
          try {

            const {iss, aud, sub, exp, ...other} = payload;

            const jwt = new SignJWT(other)
            .setProtectedHeader({ alg: 'ES256', enc: 'A256GCM'})
            .setIssuedAt();

            if (iss) jwt.setIssuer(iss);
            else if (issuer) jwt.setIssuer(issuer);

            if (aud) jwt.setAudience(aud);
            else if (audience) jwt.setAudience(audience);

            if (sub) jwt.setSubject(sub);
            else if (subject) jwt.setSubject(subject);

            if (exp) jwt.setExpirationTime(exp);
            else if (expiration) jwt.setExpirationTime(expiration);

            return await jwt.sign(secret.keys.privateKey);
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      verifyJWT: {
        value: async function verifyToken(token:string) {
          try {




            let claims: {issuer?:string, audience?:string} | undefined = {};
            if (issuer) claims.issuer = issuer;
            if (audience) claims.audience = audience;
            if (Object.keys(claims)) claims = undefined;

            const {
              payload,
              protectedHeader
            } = await jwtVerify(token, secret.keys.publicKey, claims);

            return {protectedHeader, payload};
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      encryptJWT: {
        value: async function encryptToken(payload: any){
          try {


            const {iss, aud, sub, exp, ...other} = payload;



            const jwt = new EncryptJWT(other)
            .setProtectedHeader({ alg: 'dir', enc: 'A256GCM'})
            .setIssuedAt();

            if (iss) jwt.setIssuer(iss);
            else if (issuer) jwt.setIssuer(issuer);

            if (aud) jwt.setAudience(aud);
            else if (audience) jwt.setAudience(audience);

            if (sub) jwt.setSubject(sub);
            else if (subject) jwt.setSubject(subject);

            if (exp) jwt.setExpirationTime(exp);
            else if (expiration) jwt.setExpirationTime(expiration);

            return await jwt.encrypt(secret.keys.secretKey);
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      decryptJWT: {
        value: async function decryptToken(token:string) {
          try {

            let claims: { issuer?: string, audience?: string; } | undefined = {};
            if (issuer) claims.issuer = issuer;
            if (audience) claims.audience = audience;
            if (Object.keys(claims)) claims = undefined;

            const {
              payload,
              protectedHeader
            } = await jwtDecrypt(token, secret.keys.secretKey, claims);

            return {protectedHeader, payload};
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
    });

    return Object.create(null, {
      sign: {
        value: async function (payload:object){
          try {

            if (encrypted) return await methods.encryptJWT(payload);
            else return await methods.signJWT(payload);
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      verify: {
        value: async function (token:string) {
          try {
            if (encrypted) return await methods.decryptJWT(token);
            else return await methods.verifyJWT(token);

          } catch (error) {
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

export default JWT;

// HELPER FUNCTIONS
///////////////////

function validateJWT(string:string) {
  try {
    if (typeof string !== 'string' || !string) return false;
    return isJWT(string);
  }
  catch (error) {``
    throw error;
  }
}

function setTokens(path:string) {
  try {
    const pathDirectory = join(__dirname, path);
    const pathPassphrase = join(pathDirectory, '.passphrase.jwt');
    const pathPrivateKey = join(pathDirectory, '.privateKey.jwt');
    const pathPublicKey = join(pathDirectory, '.publicKey.jwt');
    const pathSecretKey = join(pathDirectory, '.secretKey.jwt');

    const hash = crypto.createHash('sha256');
    if (
      fs.existsSync(pathDirectory)
      &&
      fs.existsSync(pathPassphrase)
      &&
      fs.existsSync(pathPrivateKey)
      &&
      fs.existsSync(pathPublicKey)
      &&
      fs.existsSync(pathSecretKey)
      ) {

      const passphrase = fs.readFileSync(pathPassphrase).toString();
      const privateKey = fs.readFileSync(pathPrivateKey).toString();
      const publicKey = fs.readFileSync(pathPublicKey).toString();
      const secretKey = fs.readFileSync(pathSecretKey).toString();

        return Object.create({}, {
          privateKey:{
            value: crypto.createPrivateKey({key: privateKey, passphrase}),
            enumerable: true,
            configurable: true
          },
          publicKey: {
            value: crypto.createPublicKey(publicKey),
            enumerable: true,
            configurable: true
          },
          secretKey: {
            value: crypto.createSecretKey(hash.digest(secretKey)),
            enumerable: true,
            configurable: true
          }
        });
  }
    else return null
  }
  catch (error) {
    console.log(error);
  }
}

function genTokens(path:string) {
  try {

    const pathDirectory = join(__dirname, path);
    const pathPassphrase = join(pathDirectory, '.passphrase.jwt');
    const pathPrivateKey = join(pathDirectory, '.privateKey.jwt');
    const pathPublicKey = join(pathDirectory, '.publicKey.jwt');
    const pathSecretKey = join(pathDirectory, '.secretKey.jwt');

    const hash = crypto.createHash('sha256');
    const key:any = crypto.generateKeySync('aes', {length: 256});
    const secretKey = hash.digest(key);
    const passphrase = crypto.randomBytes(64).toString('base64');

    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      modulusLength: 4096,
      namedCurve: 'prime256v1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: passphrase
      }
    });


    const secrets = Object.create({}, {
      privateKey: {
        value: crypto.createPrivateKey({key: privateKey, passphrase: passphrase},),
        enumerable: true,
        configurable: true
      },
      publicKey: {
        value: crypto.createPublicKey(publicKey),
        enumerable: true,
        configurable: true
      },
      secretKey: {
        value: crypto.createSecretKey(secretKey),
        enumerable: true,
        configurable: true
      }
    });

    if (!fs.existsSync(pathDirectory)) fs.mkdirSync(pathDirectory);
    fs.writeFileSync(pathPassphrase, passphrase);
    fs.writeFileSync(pathPrivateKey, privateKey);
    fs.writeFileSync(pathPublicKey, publicKey);
    fs.writeFileSync(pathSecretKey, secretKey.toString('base64'));



    return secrets;

  }
  catch (error) {
    throw error;
  }
}