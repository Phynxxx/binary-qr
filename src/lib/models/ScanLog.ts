import mongoose from 'mongoose';

const ScanLogSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true, lowercase: true },
  type: { type: String, enum: ['MEAL','SWAG'], required: true },
  mealKey: { type: String, enum: ['lunch1','dinner1','midnight','breakfast2','lunch2', null] },
  volunteerId: { type: String, default: null },
  scannedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['SUCCESS','DUPLICATE','INVALID','OUTSIDE_WINDOW','ERROR'], required: true },
  message: { type: String },
  metadata: { type: Object, default: {} }
});

export default mongoose.models.ScanLog || mongoose.model('ScanLog', ScanLogSchema);
