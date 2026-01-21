import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'global_config' },
  activePhase: {
    type: String,
    enum: ['lunch1','dinner1','midnight','breakfast2','lunch2','swag','none'],
    default: 'none'
  },
  // Optional: hold meal window definitions
  mealWindows: [{
    mealKey: String,
    label: String,
    start: Date,
    end: Date,
    enabled: Boolean
  }]
});

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema);
