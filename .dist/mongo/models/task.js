"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    taskId: { type: String, required: true, unique: true },
    taskName: { type: String, required: true },
    params: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
    startTime: { type: String, required: true },
});
const Task = mongoose_1.default.model('Task', taskSchema);
exports.Task = Task;
