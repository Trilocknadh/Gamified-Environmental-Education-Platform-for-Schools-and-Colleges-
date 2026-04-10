import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkAvatars = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const usersWithDicebear = await User.find({ avatar: /dicebear/ });
    console.log(`Found ${usersWithDicebear.length} users with Dicebear avatars.`);
    
    if (usersWithDicebear.length > 0) {
      console.log('Cleaning up avatars...');
      const result = await User.updateMany(
        { avatar: /dicebear/ },
        { $set: { avatar: null } }
      );
      console.log(`Updated ${result.modifiedCount} users.`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAvatars();
