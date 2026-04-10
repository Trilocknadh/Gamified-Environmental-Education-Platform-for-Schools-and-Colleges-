import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './models/Quiz.js';
import Material from './models/Material.js';
import User from './models/User.js';

dotenv.config();

const QUIZ_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Environmental Studies'];
const MATERIAL_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 
  'Environmental Studies', 'Climate Science', 
  'Biodiversity', 'Sustainable Living',
  'Engineering', 'General'
];

const generateQuiz = (subject, index, teacherId) => ({
  title: `${subject} Quiz ${index + 1}: Fundamentals`,
  subject,
  gradeLevel: '10',
  rewardXP: 50,
  createdBy: teacherId,
  questions: [
    {
      question: `What is the primary focus of ${subject} basics?`,
      options: ['Theory A', 'Theory B', 'Practical Application', 'Historical Context'],
      correctAnswer: 'Practical Application'
    },
    {
      question: `Which of these is a key concept in ${subject}?`,
      options: ['Concept X', 'Concept Y', 'Concept Z', 'All of the above'],
      correctAnswer: 'All of the above'
    }
  ]
});

const generateMaterial = (subject, index, teacherId) => ({
  title: `${subject} Module ${index + 1}: Introduction`,
  description: `Comprehensive study guide for ${subject} beginners. Topics include core principles and practical examples.`,
  subject,
  gradeLevel: '10',
  type: index % 2 === 0 ? 'PDF' : 'Video',
  fileUrl: 'https://example.com/demo-material.pdf',
  thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300&auto=format&fit=crop',
  category: index % 2 === 0 ? 'Academic' : 'Eco',
  createdBy: teacherId
});

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Find a teacher or create one
    let teacher = await User.findOne({ role: 'Teacher' });
    if (!teacher) {
      console.log('No teacher found, creating a demo teacher...');
      teacher = await User.create({
        name: 'Demo Teacher',
        email: 'teacher@demo.com',
        password: 'password123',
        role: 'Teacher',
        schoolName: 'Eco Academy',
        assignedClass: '10'
      });
    }

    const teacherId = teacher._id;

    // Clear existing demo data (optional, but requested "add demo")
    // Let's just add them to not delete user's data
    
    console.log('Seeding Quizzes...');
    const quizzes = [];
    for (const subject of QUIZ_SUBJECTS) {
      for (let i = 0; i < 4; i++) {
        quizzes.push(generateQuiz(subject, i, teacherId));
      }
    }
    await Quiz.insertMany(quizzes);
    console.log(`Successfully added ${quizzes.length} quizzes.`);

    console.log('Seeding Materials...');
    const materials = [];
    for (const subject of MATERIAL_SUBJECTS) {
      for (let i = 0; i < 4; i++) {
        materials.push(generateMaterial(subject, i, teacherId));
      }
    }
    await Material.insertMany(materials);
    console.log(`Successfully added ${materials.length} materials.`);

    console.log('Seeding Complete!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seed();
