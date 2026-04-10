import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Mission from './models/Mission.js';
import Quiz from './models/Quiz.js';
import User from './models/User.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Mission.deleteMany({});
    await Quiz.deleteMany({});
    await User.deleteMany({});

    // 1. Create Teacher
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('teacher123', salt);
    
    const teacher = await User.create({
      name: 'Dr. Sarah Green',
      email: 'sarah.green@gmail.com', // Fix suffix
      dateOfBirth: new Date('1985-05-15'), // Fix missing field
      password: hashedPassword,
      role: 'Teacher',
      schoolName: 'Greenwood International',
      xp: 1200,
      level: 5,
      badges: ['Expert Educator', 'Eco Guardian']
    });
    console.log('Teacher created!');

    // 2. Missions
    const missionData = [
      { 
        title: "Eco-Warrior: Plastic Free", 
        description: "Take a photo of your reusable bottle.", 
        points: 100, 
        rewardXP: 100,
        difficulty: 'Beginner',
        type: 'Eco Action',
        gradeLevel: '10',
        createdBy: teacher._id 
      },
      { 
        title: "Green Commute", 
        description: "Walk or bike and share your journey.", 
        points: 150, 
        rewardXP: 150,
        difficulty: 'Intermediate',
        type: 'Eco Action',
        gradeLevel: '10',
        createdBy: teacher._id 
      },
      { 
        title: "Waste Auditor", 
        description: "Log all waste produced in your house for one day. Categorize into recyclable, compostable, and landfill.", 
        points: 120, 
        rewardXP: 120,
        difficulty: 'Intermediate',
        type: 'Audit',
        gradeLevel: '10',
        createdBy: teacher._id 
      },
      { 
        title: "Solar Apprentice", 
        description: "Explain how a solar cell works to a friend or family member. Share a photo of a solar panel in your neighborhood.", 
        points: 80, 
        rewardXP: 80,
        difficulty: 'Beginner',
        type: 'Education',
        gradeLevel: '9',
        createdBy: teacher._id 
      },
      { 
        title: "H2O Guardian", 
        description: "Fix a leaky faucet or install a water-saving device at home. Share a 'before and after' description.", 
        points: 150, 
        rewardXP: 150,
        difficulty: 'Advanced',
        type: 'Eco Action',
        gradeLevel: '11',
        createdBy: teacher._id 
      },
      { 
        title: "Local Forager", 
        description: "Buy three items from a local farmer's market instead of a supermarket. Share a photo of the produce.", 
        points: 90, 
        rewardXP: 90,
        difficulty: 'Beginner',
        type: 'Eco Action',
        gradeLevel: '8',
        createdBy: teacher._id 
      },
      { 
        title: "Native Planter", 
        description: "Identify a native plant species in your area and explain its role in the local ecosystem.", 
        points: 100, 
        rewardXP: 100,
        difficulty: 'Intermediate',
        type: 'Education',
        gradeLevel: '12',
        createdBy: teacher._id 
      }
    ];

    for (const m of missionData) {
      await Mission.create(m);
    }
    console.log('Missions seeded!');

    // 3. Quizzes
    const quizData = [
      {
        subject: "Environmental Studies",
        title: "Climate Change Essentials",
        rewardXP: 100,
        gradeLevel: '10',
        createdBy: teacher._id,
        questions: [
          { question: "What is the primary greenhouse gas?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correctAnswer: "Carbon Dioxide" },
          { question: "Which layer protects us from UV rays?", options: ["Mesosphere", "Troposphere", "Ozone Layer", "Exosphere"], correctAnswer: "Ozone Layer" },
          { question: "Global warming is primarily caused by?", options: ["Plastic pollution", "Deforestation", "Greenhouse effect", "Melting ice"], correctAnswer: "Greenhouse effect" }
        ]
      },
      {
        subject: "Environmental Studies",
        title: "Biodiversity & Ecology",
        rewardXP: 120,
        gradeLevel: '10',
        createdBy: teacher._id,
        questions: [
          { question: "Earth Day is celebrated on?", options: ["March 22", "April 22", "June 5", "September 16"], correctAnswer: "April 22" },
          { question: "World Environment Day is on?", options: ["June 5", "April 22", "May 22", "July 11"], correctAnswer: "June 5" },
          { question: "Which gas is released during photosynthesis?", options: ["CO2", "Carbon", "Oxygen", "Methane"], correctAnswer: "Oxygen" }
        ]
      },
      {
        subject: "Mathematics",
        title: "Algebraic Foundations",
        rewardXP: 150,
        gradeLevel: '10',
        createdBy: teacher._id,
        questions: [
          { question: "Solve for x: 3x - 7 = 11", options: ["4", "5", "6", "7"], correctAnswer: "6" },
          { question: "What is (x + y)²?", options: ["x² + y²", "x² + 2xy + y²", "x² - 2xy + y²", "x² + xy + y²"], correctAnswer: "x² + 2xy + y²" },
          { question: "Value of x in 5x = 25?", options: ["1", "5", "10", "25"], correctAnswer: "5" }
        ]
      },
      {
        subject: "Mathematics",
        title: "Geometry Basics",
        rewardXP: 140,
        gradeLevel: '10',
        createdBy: teacher._id,
        questions: [
          { question: "Sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correctAnswer: "180°" },
          { question: "Area of a circle?", options: ["2πr", "πr²", "πd", "4πr²"], correctAnswer: "πr²" },
          { question: "Pythagoras theorem is for which triangle?", options: ["Equilateral", "Scalene", "Right-angled", "Isosceles"], correctAnswer: "Right-angled" }
        ]
      },
      {
        subject: "Physics",
        title: "Laws of Motion",
        rewardXP: 150,
        gradeLevel: '10',
        createdBy: teacher._id,
        questions: [
          { question: "First law of motion is also called?", options: ["Law of Speed", "Law of Inertia", "Law of Force", "Law of Energy"], correctAnswer: "Law of Inertia" },
          { question: "F = ma stands for?", options: ["Force = Mass x Area", "Force = Motion x Acceleration", "Force = Mass x Acceleration", "Force = Momentum x Acceleration"], correctAnswer: "Force = Mass x Acceleration" },
          { question: "Unit of Force?", options: ["Joule", "Watt", "Newton", "Pascal"], correctAnswer: "Newton" }
        ]
      },
      {
        subject: "Physics",
        title: "Electricity & Circuits",
        rewardXP: 160,
        gradeLevel: '10',
        createdBy: teacher._id,
        questions: [
          { question: "Unit of Electric Current?", options: ["Volt", "Ohm", "Ampere", "Watt"], correctAnswer: "Ampere" },
          { question: "Ohm's Law formula?", options: ["V = IR", "P = VI", "R = V/I", "Both A and C"], correctAnswer: "Both A and C" },
          { question: "Materials that allow electricity to flow?", options: ["Insulators", "Conductors", "Resistors", "Capacitors"], correctAnswer: "Conductors" }
        ]
      },
      {
        subject: "Chemistry",
        title: "Periodic Table Basics",
        rewardXP: 150,
        gradeLevel: '10',
        createdBy: teacher._id,
        questions: [
          { question: "Atomic symbol for Iron?", options: ["Ir", "Fe", "In", "I"], correctAnswer: "Fe" },
          { question: "Most abundant gas in Atmosphere?", options: ["Oxygen", "CO2", "Nitrogen", "Hydrogen"], correctAnswer: "Nitrogen" },
          { question: "Periodic table creator?", options: ["Newton", "Dalton", "Mendeleev", "Bohr"], correctAnswer: "Mendeleev" }
        ]
      },
      {
        subject: "Chemistry",
        title: "Acids, Bases & Salts",
        rewardXP: 150,
        gradeLevel: '10',
        createdBy: teacher._id,
        questions: [
          { question: "pH of pure water?", options: ["0", "1", "7", "14"], correctAnswer: "7" },
          { question: "Acid in lemon?", options: ["Acetic", "Citric", "Tartaric", "Lactic"], correctAnswer: "Citric" },
          { question: "Common Salt formula?", options: ["HCl", "NaOH", "NaCl", "KCl"], correctAnswer: "NaCl" }
        ]
      }
    ];

    for (const q of quizData) {
      await Quiz.create(q);
    }
    console.log('Quizzes seeded!');

    // 4. Create Students
    const studentData = [
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@gmail.com',
        dateOfBirth: new Date('2008-03-20'),
        password: hashedPassword,
        role: 'Student',
        schoolName: 'Greenwood International',
        xp: 850,
        level: 4,
        streak: 5,
        ecoXp: 450,
        eduXp: 400,
        badges: ['Newbie', 'Recycler'],
        interestXp: new Map([['Mathematics', 150], ['Environmental Studies', 250]])
      },
      {
        name: 'Maya Chen',
        email: 'maya.chen@gmail.com',
        dateOfBirth: new Date('2009-07-12'),
        password: hashedPassword,
        role: 'Student',
        schoolName: 'Greenwood International',
        xp: 1100,
        level: 5,
        streak: 12,
        ecoXp: 300,
        eduXp: 800,
        badges: ['Academically Gifted'],
        interestXp: new Map([['Physics', 300], ['Chemistry', 500]])
      },
      {
        name: 'Sam Wilson',
        email: 'sam.wilson@gmail.com',
        dateOfBirth: new Date('2008-11-05'),
        password: hashedPassword,
        role: 'Student',
        schoolName: 'Greenwood International',
        xp: 600,
        level: 3,
        streak: 2,
        ecoXp: 500,
        eduXp: 100,
        badges: ['Newbie'],
        interestXp: new Map([['Environmental Studies', 100]])
      }
    ];

    for (const s of studentData) {
      await User.create(s);
    }
    console.log('Mock students seeded!');

    await mongoose.connection.close();
    console.log('SUCCESS: Seeding completed.');
    console.log('Login: sarah.green@gmail.com / teacher123');
    process.exit(0);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error Details:');
      for (let field in error.errors) {
        console.error(`- ${field}: ${error.errors[field].message}`);
      }
    } else {
      console.error('General Error:', error);
    }
    process.exit(1);
  }
};

seedDB();
