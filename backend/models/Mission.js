import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  points: { type: Number, required: true, default: 50 },
  rewardXP: { type: Number, default: 100 },
  difficulty: { type: String, default: 'Intermediate' },
  type: { type: String, default: 'Eco Action' },
  gradeLevel: { type: String, enum: ['6', '7', '8', '9', '10', '11', '12', 'B.Tech', 'Degree'], default: '10' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Mission', missionSchema);
