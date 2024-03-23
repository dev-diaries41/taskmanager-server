import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
  hashedApiKey: {type: String, required:true, unique: true},
  userEmail: {type: String, required:true, unique: true},
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now}
});


const Auth = mongoose.model('Auth', authSchema);

export {Auth};