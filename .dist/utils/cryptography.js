"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMessage = exports.signMessage = exports.genKeyPair = exports.hashPassword = exports.hmacHash = exports.hash = exports.rsaDecrypt = exports.symmertricDecrypt = exports.rsaEncrypt = exports.symmetricEncrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Symmetric encryption
function symmetricEncrypt(message, myKey = null) {
    const key = myKey || crypto_1.default.randomBytes(32);
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv('aes-256-gcm', key, iv);
    const encryptedMessage = cipher.update(message, 'utf-8', 'hex') + cipher.final('hex');
    const tag = cipher.getAuthTag();
    return {
        encryptedMessage,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        key: key.toString('hex')
    };
}
exports.symmetricEncrypt = symmetricEncrypt;
// Asymmetric encryption
function rsaEncrypt(publicKey, data) {
    return crypto_1.default.publicEncrypt(publicKey, Buffer.from(data));
}
exports.rsaEncrypt = rsaEncrypt;
// Symmetric decryption
function symmertricDecrypt(encryptedMessage, iv, tag, key) {
    const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf-8');
    return decryptedMessage;
}
exports.symmertricDecrypt = symmertricDecrypt;
// Asymmetric decryption
function rsaDecrypt(privateKey, encryptedData) {
    return crypto_1.default.privateDecrypt(privateKey, encryptedData).toString('utf-8');
}
exports.rsaDecrypt = rsaDecrypt;
// General purpose hasing
function hash(valueToHash) {
    return crypto_1.default.createHash('sha512').update(valueToHash).digest('hex');
}
exports.hash = hash;
function hmacHash(key, valueToHash) {
    return crypto_1.default.createHmac('sha512', key).update(valueToHash).digest('hex');
}
exports.hmacHash = hmacHash;
// For secure password hashing
function hashPassword(password, salt) {
    const hashedPassword = crypto_1.default.scryptSync(password, salt, 64);
    return hashedPassword;
}
exports.hashPassword = hashPassword;
function genKeyPair() {
    const { privateKey, publicKey } = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            // cipher: 'aes-256-cbc',
            // passphrase: passphrase 
        }
    });
    return { publicKey, privateKey };
}
exports.genKeyPair = genKeyPair;
function signMessage(privateKey, message) {
    const signer = crypto_1.default.createSign('rsa-sha256');
    signer.update(message);
    const signature = signer.sign(privateKey, 'hex');
    return { message, signature };
}
exports.signMessage = signMessage;
function verifyMessage(publicKey, message, signature) {
    const verifier = crypto_1.default.createVerify('rsa-sha256');
    verifier.update(message);
    const isVerified = verifier.verify(publicKey, signature, 'hex');
    return { message, isVerified };
}
exports.verifyMessage = verifyMessage;
