import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

const updateAdminPin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecoedu');
    console.log('Connected to MongoDB...');

    const admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      console.log('Admin user not found!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash('013024', salt);

    admin.adminPin = hashedPin;
    await admin.save();

    console.log('Admin PIN updated successfully!');
    console.log('Email: admin@gmail.com');
    console.log('New PIN: 013024');
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin PIN:', error);
    process.exit(1);
  }
};

updateAdminPin();
