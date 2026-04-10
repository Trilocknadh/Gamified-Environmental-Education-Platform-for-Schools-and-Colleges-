import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ['Mathematics', 'Physics', 'Chemistry', 'Environmental Studies'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  rewardXP: {
    type: Number,
    default: 10,
  },
  gradeLevel: {
    type: String,
    enum: ['6', '7', '8', '9', '10', '11', '12', 'BTech', 'Degree'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
