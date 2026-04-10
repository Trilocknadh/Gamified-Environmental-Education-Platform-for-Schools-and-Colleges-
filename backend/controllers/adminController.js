import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Mission from '../models/Mission.js';
import Submission from '../models/Submission.js';
import bcrypt from 'bcrypt';

// @desc    Get platform statistics
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'Student' });
    const teacherCount = await User.countDocuments({ role: 'Teacher' });
    const quizCount = await Quiz.countDocuments();
    const missionCount = await Mission.countDocuments();

    // User growth (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      studentCount,
      teacherCount,
      quizCount,
      missionCount,
      userGrowth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new user
// @route   POST /api/admin/add-user
export const addUser = async (req, res) => {
  const { name, email, password, role, schoolName, adminPin } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let hashedPin = undefined;
    if (role === 'Admin') {
       if (!adminPin || adminPin.length !== 6 || isNaN(adminPin)) {
         return res.status(400).json({ message: 'Admin role requires a 6-digit security PIN' });
       }
       hashedPin = await bcrypt.hash(adminPin, salt);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      adminPin: hashedPin,
      role,
      schoolName,
      dateOfBirth: new Date() // Placeholder or as needed
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/delete-user/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get performance analytics
// @route   GET /api/admin/performance
export const getPerformanceMetrics = async (req, res) => {
  try {
    const studentPerformance = await User.find({ role: 'Student' })
      .select('name xp level schoolName badges')
      .sort('-xp')
      .limit(10);

    const teacherPerformance = await User.find({ role: 'Teacher' })
      .select('name schoolName')
      .limit(10);
    
    // For teachers, we'd ideally count their created quizzes/missions
    // This is a simplified version
    const teachersWithCounts = await Promise.all(teacherPerformance.map(async (teacher) => {
        const quizCount = await Quiz.countDocuments({ creator: teacher._id });
        const missionCount = await Mission.countDocuments({ creator: teacher._id });
        return {
            ...teacher.toObject(),
            quizCount,
            missionCount
        };
    }));

    res.json({
      topStudents: studentPerformance,
      topTeachers: teachersWithCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports
// @route   GET /api/admin/reports
export const getReports = async (req, res) => {
  try {
    // Mission completion rates
    const totalSubmissions = await Submission.countDocuments();
    const approvedSubmissions = await Submission.countDocuments({ status: 'Approved' });
    
    // Most attempted subjects (from quizzes)
    const subjectStats = await Quiz.aggregate([
        { $group: { _id: "$subject", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    res.json({
        missionStats: {
            total: totalSubmissions,
            approved: approvedSubmissions,
            rate: totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0
        },
        subjectStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin settings (PIN/Password)
// @route   PUT /api/admin/settings
export const updateAdminSettings = async (req, res) => {
  const { password, adminPin } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (adminPin) {
      if (adminPin.length !== 6 || isNaN(adminPin)) {
        return res.status(400).json({ message: 'Security PIN must be 6 digits' });
      }
      const salt = await bcrypt.genSalt(10);
      user.adminPin = await bcrypt.hash(adminPin, salt);
    }

    await user.save();

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
