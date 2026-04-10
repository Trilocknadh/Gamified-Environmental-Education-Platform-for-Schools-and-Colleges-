import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Material from './models/Material.js';
import User from './models/User.js';

dotenv.config();

const materials = [
  // Class 6
  { title: 'Class 6: Food - Where does it come from?', subject: 'Environmental Studies', gradeLevel: '6', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/fesc101.pdf', thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=400', category: 'Academic', description: 'Essential notes on food sources and nutrition for Class 6.' },
  { title: 'Class 6: Components of Food', subject: 'General', gradeLevel: '6', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/fesc102.pdf', thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400', category: 'Academic', description: 'Understanding carbohydrates, proteins, and vitamins.' },

  // Class 7
  { title: 'Class 7: Nutrition in Plants', subject: 'General', gradeLevel: '7', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/gesc101.pdf', thumbnail: 'https://images.unsplash.com/photo-1530836361253-efad5cb2fe20?q=80&w=400', category: 'Academic', description: 'How plants produce food through photosynthesis.' },
  { title: 'Class 7: Heat Fundamentals', subject: 'Physics', gradeLevel: '7', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/gesc104.pdf', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400', category: 'Academic', description: 'Introduction to thermal energy and temperature.' },

  // Class 8
  { title: 'Class 8: Crop Production & Management', subject: 'Environmental Studies', gradeLevel: '8', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/hesc101.pdf', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400', category: 'Academic', description: 'Agricultural practices and food security for Class 8.' },
  { title: 'Class 8: Microorganisms Friend and Foe', subject: 'General', gradeLevel: '8', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/hesc102.pdf', thumbnail: 'https://images.unsplash.com/photo-1583541815182-f37719601d36?q=80&w=400', category: 'Academic', description: 'The role of microbes in medicine and environment.' },

  // Class 9
  { title: 'Class 9: Matter in Our Surroundings', subject: 'Chemistry', gradeLevel: '9', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/iesc101.pdf', thumbnail: 'https://images.unsplash.com/photo-1628113310823-920f01ba342e?q=80&w=400', category: 'Academic', description: 'Exploration of solids, liquids, and gases.' },
  { title: 'Class 9: Force and Laws of Motion', subject: 'Physics', gradeLevel: '9', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/iesc109.pdf', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400', category: 'Academic', description: 'Newtonian mechanics for secondary students.' },

  // Class 10 (Already have many, adding representative ones)
  { title: 'Class 10: Real Numbers', subject: 'Mathematics', gradeLevel: '10', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/jemh101.pdf', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400', category: 'Academic', description: 'Numerical systems and theorems for Grade 10.' },
  { title: 'Class 10: Electricity', subject: 'Physics', gradeLevel: '10', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/jesc112.pdf', thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=400', category: 'Academic', description: 'Circuits, Ohm\'s law, and resistance.' },

  // Class 11
  { title: 'Class 11: Physical World', subject: 'Physics', gradeLevel: '11', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/keph101.pdf', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400', category: 'Academic', description: 'Introduction to scientific methods and fundamental forces.' },
  { title: 'Class 11: Sets & Relations', subject: 'Mathematics', gradeLevel: '11', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/kemh101.pdf', thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=400', category: 'Academic', description: 'Advanced set theory and algebraic relations.' },

  // Class 12
  { title: 'Class 12: Electrostatics', subject: 'Physics', gradeLevel: '12', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/leph101.pdf', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400', category: 'Academic', description: 'Charge distribution and electric fields for seniors.' },
  { title: 'Class 12: Relations and Functions', subject: 'Mathematics', gradeLevel: '12', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/lemh101.pdf', thumbnail: 'https://images.unsplash.com/photo-1509228539251-0849865b20a1?q=80&w=400', category: 'Academic', description: 'Advanced calculus prep and functional analysis.' },

  // B.Tech
  { title: 'B.Tech: Data Structures & Algorithms', subject: 'Engineering', gradeLevel: 'BTech', type: 'Note', fileUrl: 'https://www.cs.princeton.edu/courses/archive/spr10/cos226/lectures/01-12Intro.pdf', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400', category: 'Academic', description: 'Fundamental concepts for computer science undergraduates.' },
  { title: 'B.Tech: Thermodynamics for Engineers', subject: 'Engineering', gradeLevel: 'BTech', type: 'Note', fileUrl: 'https://web.mit.edu/16.unified/www/FALL/thermodynamics/notes/notes.html', thumbnail: 'https://images.unsplash.com/photo-1581093458791-9f3c3900ca91?q=80&w=400', category: 'Academic', description: 'Energy systems and heat transfer principles.' },

  // Degree
  { title: 'Degree: Principles of Modern Management', subject: 'General', gradeLevel: 'Degree', type: 'Article', fileUrl: 'https://openstax.org/details/books/principles-management', thumbnail: 'https://images.unsplash.com/photo-1454165833067-0620c031c360?q=80&w=400', category: 'Academic', description: 'Leadership and organizational theory for degree students.' },
  { title: 'Degree: History of Economics', subject: 'General', gradeLevel: 'Degree', type: 'Article', fileUrl: 'https://open.umn.edu/opentextbooks/textbooks/31', thumbnail: 'https://images.unsplash.com/photo-1518186239751-2477ef39e365?q=80&w=400', category: 'Academic', description: 'Developing understanding of global economic evolution.' },

  // Eco Materials (keeping them)
  { title: 'Eco: Understanding Climate Change', subject: 'Climate Science', gradeLevel: '10', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/jess101.pdf', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400', category: 'Eco', description: 'Global warming causes and their impact on our planet.' },
  { title: 'Eco: Flora and Fauna Protection', subject: 'Biodiversity', gradeLevel: '10', type: 'PDF', fileUrl: 'https://ncert.nic.in/textbook/pdf/jess102.pdf', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400', category: 'Eco', description: 'Conservation strategies for wildlife and forests.' }
];

const seedMaterials = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecoedu';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Universal Hub Seeding...');
    
    const teacher = await User.findOne({ role: { $in: ['Teacher', 'Admin'] } });
    if (!teacher) {
      console.log('No Teacher/Admin found.');
      process.exit(1);
    }

    const materialsWithCreator = materials.map(m => ({
      ...m,
      createdBy: teacher._id
    }));

    await Material.deleteMany();
    await Material.insertMany(materialsWithCreator);
    
    console.log(`Successfully seeded ${materialsWithCreator.length} results across all educational milestones!`);
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Quick fix for the typo in the console log variable name
const allSamples = materials.length; 
console.log(`Ready to seed ${allSamples} items...`);

seedMaterials();
