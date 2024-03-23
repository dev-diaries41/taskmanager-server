"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const articleSchema = new mongoose_1.default.Schema({
    url: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    pubDate: { type: String, required: true },
    source: { type: String, required: true },
    summary: { type: String, required: true },
});
const Article = mongoose_1.default.model('Article', articleSchema);
exports.Article = Article;
