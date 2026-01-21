import mongoose from 'mongoose';

const MealSub = {
  claimed: { type: Boolean, default: false },
  claimedAt: { type: Date, default: null },
  claimedBy: { type: String, default: null } // volunteerId or device id
};

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  meals: {
    lunch1: { ...MealSub },
    dinner1: { ...MealSub },
    midnight: { ...MealSub },
    breakfast2: { ...MealSub },
    lunch2: { ...MealSub }
  },
  swag: { ...MealSub },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt on save
UserSchema.pre('save', function(next: any){ this.updatedAt = new Date(); next(); });

export default mongoose.models.User || mongoose.model('User', UserSchema);
