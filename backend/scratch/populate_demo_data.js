import mongoose from 'mongoose';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const indianNames = [
  "Aarav Mehta", "Ishaan Sharma", "Ananya Iyer", "Diya Patel", "Vihaan Malhotra",
  "Saanvi Kulkarni", "Arjun Nair", "Prisha Gupta", "Rohan Das", "Myra Reddy",
  "Vivaan Choudhury", "Kyra Singh", "Shaurya Bhat", "Advait Joshi", "Zoya Khan",
  "Kabir Verma", "Inaya Saxena", "Reyansh Gill", "Aavya Desai", "Daksh Rao"
];

const demoFeedbacks = [
  { subject: "Plastic in canteen", message: "I saw too much single-use plastic in the canteen today. Can we ban plastic straws?" },
  { subject: "Eco-Quest Bug", message: "The last quiz on Biodiversity didn't record my score correctly in the leaderboard." },
  { subject: "New Mission Idea", message: "We should have a mission for planting native trees in the school yard during the monsoon." },
  { subject: "Water Fountain Leak", message: "The water fountain near the library has been leaking for two days. It's wasting a lot of water!" },
  { subject: "Educational Videos", message: "Can we have more videos in the Environmental Studies section? Visuals help us learn faster." },
  { subject: "Recycling Bins", message: "There aren't enough recycling bins in the playground. Students are throwing paper on the ground." },
  { subject: "Garden Proposal", message: "I want to start a small butterfly garden in the school. Whom should I contact for permission?" }
];

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for demo data seeding...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('teacher123', salt);

    const students = [];
    for (const name of indianNames) {
      const email = `${name.toLowerCase().replace(' ', '.')}@gmail.com`;
      
      const student = await User.findOneAndUpdate(
        { email },
        {
          name,
          email,
          password: hashedPassword,
          role: 'Student',
          schoolName: 'Greenwood International',
          dateOfBirth: new Date(`2008-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`),
          xp: Math.floor(Math.random() * 2000) + 100,
          level: Math.floor(Math.random() * 8) + 1,
          streak: Math.floor(Math.random() * 15),
          assignedClass: (Math.floor(Math.random() * 7) + 6).toString(), // Grades 6-12
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        },
        { upsert: true, new: true }
      );
      students.push(student);
    }
    console.log(`Successfully created/updated ${students.length} students.`);

    // Create demo feedbacks linked to random students
    let feedbackCount = 0;
    for (const fb of demoFeedbacks) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      
      await Feedback.create({
        userId: randomStudent._id,
        subject: fb.subject,
        message: fb.message,
        status: Math.random() > 0.5 ? 'Pending' : 'Resolved'
      });
      feedbackCount++;
    }
    console.log(`Successfully created ${feedbackCount} demo feedback entries.`);

    await mongoose.connection.close();
    console.log('DONE: Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during demo seeding:', error);
    process.exit(1);
  }
};

seedDemoData();
