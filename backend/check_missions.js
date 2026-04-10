import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mission from './models/Mission.js';

dotenv.config();

const checkMissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Mission.countDocuments();
    const missions = await Mission.find({}, 'title gradeLevel');
    console.log(`Found ${count} missions:`);
    missions.forEach(m => console.log(`- ${m.title} (${m.gradeLevel})`));
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkMissions();
