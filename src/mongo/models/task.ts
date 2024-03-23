import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskId:{type: String, required:true, unique: true},
  taskName: {type: String, required:true},
  params: {type: mongoose.Schema.Types.Mixed, required:true},
  startTime: {type: String, required:true},
});


const Task = mongoose.model('Task', taskSchema);

export {Task};