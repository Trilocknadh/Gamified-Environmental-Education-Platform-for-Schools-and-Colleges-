import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for data fix...');

    const result = await User.updateOne(
      { email: 'Teacher12@gmail.com' },
      { $set: { schoolName: 'Greenwood International' } }
    );

    if (result.modifiedCount > 0) {
      console.log('SUCCESS: Teacher school name updated to Greenwood International!');
    } else {
      console.log('NOTICE: No changes made. Teacher may already have the correct school name or the email was not found.');
      
      // Double check if teacher exists
      const teacher = await User.findOne({ email: 'Teacher12@gmail.com' });
      if (teacher) {
        console.log(`Current teacher schoolName: "${teacher.schoolName}"`);
      } else {
        console.log('ERROR: Teacher account with email "Teacher12@gmail.com" not found.');
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during data fix:', error);
    process.exit(1);
  }
};

fixData();
