"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB(url) {
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(url);
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.error('Failed to connect with MongoDB');
        console.error(err);
    }
}
exports.default = connectDB;
