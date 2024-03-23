"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const auth_1 = require("../mongo/models/auth");
const cryptography_1 = require("../utils/cryptography");
async function authenticate(req, res, next) {
    const apiKey = req.headers['api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'Missing API key' });
    }
    const hashedApiKey = (0, cryptography_1.hash)(apiKey);
    const document = await auth_1.Auth.findOne({ hashedApiKey });
    //hashedApiKey is an index so finding one means that api key is valid
    if (document?.hashedApiKey) {
        next(); // Request is authorized
    }
    else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
exports.authenticate = authenticate;
