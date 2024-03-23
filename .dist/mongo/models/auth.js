"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const authSchema = new mongoose_1.default.Schema({
    hashedApiKey: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});
const Auth = mongoose_1.default.model('Auth', authSchema);
exports.Auth = Auth;
