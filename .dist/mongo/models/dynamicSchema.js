"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const documentSchema = new mongoose_1.default.Schema({
    uid: { type: String, required: true, unique: true },
    data: mongoose_1.default.Schema.Types.Mixed,
    tag: { type: String, required: true },
    lastModified: { type: Date, default: Date.now } // Added "lastModified" property
});
function createCollectionWithSchema(collectionName) {
    const CollectionModel = mongoose_1.default.model(collectionName, documentSchema, collectionName.toLowerCase());
    return CollectionModel;
}
exports.default = createCollectionWithSchema;
