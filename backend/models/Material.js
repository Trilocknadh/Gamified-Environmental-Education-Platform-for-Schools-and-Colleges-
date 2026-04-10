import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    enum: [
      'Mathematics', 'Physics', 'Chemistry', 
      'Environmental Studies', 'Climate Science', 
      'Biodiversity', 'Sustainable Living',
      'Engineering', 'General'
    ],
    required: true,
  },
  gradeLevel: {
    type: String,
    enum: ['6', '7', '8', '9', '10', '11', '12', 'BTech', 'Degree', 'Global'],
    required: true,
  },
  type: {
    type: String,
    enum: ['PDF', 'Video', 'Note', 'Article'],
    default: 'Note',
  },
  fileUrl: {
    type: String,
    required: true, // Placeholder or actual URL
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300&auto=format&fit=crop',
  },
  category: {
    type: String,
    enum: ['Academic', 'Eco'],
    default: 'Academic',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
