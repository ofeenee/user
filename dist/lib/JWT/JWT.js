"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
// import { fileURLToPath } from 'url';
const path_1 = require("path");
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const validator_1 = __importDefault(require("validator"));
const { isJWT } = validator_1.default;
const jose = __importStar(require("jose"));
const { SignJWT, jwtVerify, EncryptJWT, jwtDecrypt } = jose;
// interface fnJWT {
//   new (o: jwtOptions): any;    // constructor
//   (o: jwtOptions): any;       // call
// }
function JWT(o) {
    var _a;
    try {
        if (new.target === undefined)
            return new JWT(o);
        const { issuer, audience, expiration, encrypted, subject, path } = o !== null && o !== void 0 ? o : { issuer: null, audience: null, expiration: null, encrypted: false, subject: null, path: '.secrets' };
        const secret = Object.create({}, {
            keys: {
                value: (_a = setTokens(path)) !== null && _a !== void 0 ? _a : genTokens(path),
                enumerable: true
            },
        });
        Object.defineProperties(this, {
            validateJWT: {
                value: validateJWT,
                enumerable: true
            },
            signJWT: {
                value: async function signToken(payload) {
                    try {
                        const { iss, aud, sub, exp } = payload, other = __rest(payload, ["iss", "aud", "sub", "exp"]);
                        const jwt = new SignJWT(other)
                            .setProtectedHeader({ alg: 'ES256', enc: 'A256GCM' })
                            .setIssuedAt();
                        if (iss)
                            jwt.setIssuer(iss);
                        else if (issuer)
                            jwt.setIssuer(issuer);
                        if (aud)
                            jwt.setAudience(aud);
                        else if (audience)
                            jwt.setAudience(audience);
                        if (sub)
                            jwt.setSubject(sub);
                        else if (subject)
                            jwt.setSubject(subject);
                        if (exp)
                            jwt.setExpirationTime(exp);
                        else if (expiration)
                            jwt.setExpirationTime(expiration);
                        return await jwt.sign(secret.keys.privateKey);
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            verifyJWT: {
                value: async function verifyToken(token) {
                    try {
                        let claims = {};
                        if (issuer)
                            claims.issuer = issuer;
                        if (audience)
                            claims.audience = audience;
                        if (Object.keys(claims))
                            claims = undefined;
                        const { payload, protectedHeader } = await jwtVerify(token, secret.keys.publicKey, claims);
                        return { protectedHeader, payload };
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            encryptJWT: {
                value: async function encryptToken(payload) {
                    try {
                        const { iss, aud, sub, exp } = payload, other = __rest(payload, ["iss", "aud", "sub", "exp"]);
                        const jwt = new EncryptJWT(other)
                            .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
                            .setIssuedAt();
                        if (iss)
                            jwt.setIssuer(iss);
                        else if (issuer)
                            jwt.setIssuer(issuer);
                        if (aud)
                            jwt.setAudience(aud);
                        else if (audience)
                            jwt.setAudience(audience);
                        if (sub)
                            jwt.setSubject(sub);
                        else if (subject)
                            jwt.setSubject(subject);
                        if (exp)
                            jwt.setExpirationTime(exp);
                        else if (expiration)
                            jwt.setExpirationTime(expiration);
                        return await jwt.encrypt(secret.keys.secretKey);
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            decryptJWT: {
                value: async function decryptToken(token) {
                    try {
                        let claims = {};
                        if (issuer)
                            claims.issuer = issuer;
                        if (audience)
                            claims.audience = audience;
                        if (Object.keys(claims))
                            claims = undefined;
                        const { payload, protectedHeader } = await jwtDecrypt(token, secret.keys.secretKey, claims);
                        return { protectedHeader, payload };
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
        });
        return Object.create(this, {
            sign: {
                value: async (payload) => {
                    try {
                        if (encrypted)
                            return await this.encryptJWT(payload);
                        else
                            return await this.signJWT(payload);
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            verify: {
                value: async (token) => {
                    try {
                        if (encrypted)
                            return await this.decryptJWT(token);
                        else
                            return await this.verifyJWT(token);
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
exports.default = JWT;
// HELPER FUNCTIONS
///////////////////
function validateJWT(string) {
    try {
        if (typeof string !== 'string' || !string)
            return false;
        return isJWT(string);
    }
    catch (error) {
        ``;
        throw error;
    }
}
function setTokens(path) {
    try {
        const pathDirectory = (0, path_1.join)(__dirname, path);
        const pathPassphrase = (0, path_1.join)(pathDirectory, '.passphrase.jwt');
        const pathPrivateKey = (0, path_1.join)(pathDirectory, '.privateKey.jwt');
        const pathPublicKey = (0, path_1.join)(pathDirectory, '.publicKey.jwt');
        const pathSecretKey = (0, path_1.join)(pathDirectory, '.secretKey.jwt');
        const hash = crypto_1.default.createHash('sha256');
        if (fs_1.default.existsSync(pathDirectory)
            &&
                fs_1.default.existsSync(pathPassphrase)
            &&
                fs_1.default.existsSync(pathPrivateKey)
            &&
                fs_1.default.existsSync(pathPublicKey)
            &&
                fs_1.default.existsSync(pathSecretKey)) {
            const passphrase = fs_1.default.readFileSync(pathPassphrase).toString();
            const privateKey = fs_1.default.readFileSync(pathPrivateKey).toString();
            const publicKey = fs_1.default.readFileSync(pathPublicKey).toString();
            const secretKey = fs_1.default.readFileSync(pathSecretKey).toString();
            return Object.create({}, {
                privateKey: {
                    value: crypto_1.default.createPrivateKey({ key: privateKey, passphrase }),
                    enumerable: true,
                    configurable: true
                },
                publicKey: {
                    value: crypto_1.default.createPublicKey(publicKey),
                    enumerable: true,
                    configurable: true
                },
                secretKey: {
                    value: crypto_1.default.createSecretKey(hash.digest(secretKey)),
                    enumerable: true,
                    configurable: true
                }
            });
        }
        else
            return null;
    }
    catch (error) {
        console.log(error);
    }
}
function genTokens(path) {
    try {
        const pathDirectory = (0, path_1.join)(__dirname, path);
        const pathPassphrase = (0, path_1.join)(pathDirectory, '.passphrase.jwt');
        const pathPrivateKey = (0, path_1.join)(pathDirectory, '.privateKey.jwt');
        const pathPublicKey = (0, path_1.join)(pathDirectory, '.publicKey.jwt');
        const pathSecretKey = (0, path_1.join)(pathDirectory, '.secretKey.jwt');
        const hash = crypto_1.default.createHash('sha256');
        const key = crypto_1.default.generateKeySync('aes', { length: 256 });
        const secretKey = hash.digest(key);
        const passphrase = crypto_1.default.randomBytes(64).toString('base64');
        const { privateKey, publicKey } = crypto_1.default.generateKeyPairSync('ec', {
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
                value: crypto_1.default.createPrivateKey({ key: privateKey, passphrase: passphrase }),
                enumerable: true,
                configurable: true
            },
            publicKey: {
                value: crypto_1.default.createPublicKey(publicKey),
                enumerable: true,
                configurable: true
            },
            secretKey: {
                value: crypto_1.default.createSecretKey(secretKey),
                enumerable: true,
                configurable: true
            }
        });
        if (!fs_1.default.existsSync(pathDirectory))
            fs_1.default.mkdirSync(pathDirectory);
        fs_1.default.writeFileSync(pathPassphrase, passphrase);
        fs_1.default.writeFileSync(pathPrivateKey, privateKey);
        fs_1.default.writeFileSync(pathPublicKey, publicKey);
        fs_1.default.writeFileSync(pathSecretKey, secretKey.toString('base64'));
        return secrets;
    }
    catch (error) {
        throw error;
    }
}
