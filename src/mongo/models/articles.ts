import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  url: {type: String, required:true, unique: true},
  title: {type: String, required:true, unique: true},
  pubDate: {type: String, required:true},
  source: {type: String, required:true},
  summary: {type: String, required: true},
});


const Article = mongoose.model('Article', articleSchema);

export {Article};