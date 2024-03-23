import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true},
  data: mongoose.Schema.Types.Mixed,
  tag: { type: String, required: true},
  lastModified: { type: Date, default: Date.now } // Added "lastModified" property
});

function createCollectionWithSchema(collectionName: string) {
  const CollectionModel = mongoose.model(collectionName, documentSchema, collectionName.toLowerCase());
  return CollectionModel;
}

export default createCollectionWithSchema;

