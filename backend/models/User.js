import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@gmail\.com$/, 'Please use a valid @gmail.com address'],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Teacher', 'Admin'],
    default: 'Student',
  },
  adminPin: {
    type: String, // Hashed 6-digit PIN for Admins
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  streak: {
    type: Number,
    default: 0,
  },
  badges: {
    type: [String],
    default: [],
  },
  avatar: {
    type: String,
    default: null, // Custom avatar upload implementation
  },
  schoolName: {
    type: String,
    default: '',
  },
  assignedClass: {
    type: String,
    default: '',
  },
  interests: {
    type: [String],
    default: [],
  },
  aboutMe: {
    type: String,
    default: '',
  },
  collegeName: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  subjectExpertise: {
    type: String,
    default: '',
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  industry: {
    type: String,
    default: 'Information Technology',
  },
  professionalSkills: {
    type: [String],
    default: [],
  },
  skillsOfInterest: {
    type: [String],
    default: [],
  },
  ecoXp: {
    type: Number,
    default: 0,
  },
  eduXp: {
    type: Number,
    default: 0,
  },
  interestXp: {
    type: Map,
    of: Number,
    default: {},
  },
  improvementPoints: {
    type: Map,
    of: Number,
    default: {},
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
