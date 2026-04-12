import User from '../models/User.js';
import Submission from '../models/Submission.js';
import QuizResult from '../models/QuizResult.js';
import Material from '../models/Material.js';

// @desc    Get all students
// @route   GET /api/users/students
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).select('-password').sort('name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Award a badge to a student
// @route   POST /api/users/:id/badge
export const awardBadge = async (req, res) => {
  const { badge } = req.body;
  if (!badge) {
    return res.status(400).json({ message: 'Badge name is required' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.badges.includes(badge)) {
      return res.status(400).json({ message: 'Student already has this badge' });
    }

    user.badges.push(badge);
    await user.save();

    res.json({ message: `Badge "${badge}" awarded to ${user.name}!`, badges: user.badges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.avatar = req.body.avatar || user.avatar;
    user.schoolName = req.body.schoolName || user.schoolName;
    user.interests = req.body.interests || user.interests;
    user.aboutMe = req.body.aboutMe !== undefined ? req.body.aboutMe : user.aboutMe;
    user.collegeName = req.body.collegeName !== undefined ? req.body.collegeName : user.collegeName;
    user.industry = req.body.industry !== undefined ? req.body.industry : user.industry;
    user.professionalSkills = req.body.professionalSkills !== undefined ? req.body.professionalSkills : user.professionalSkills;
    user.skillsOfInterest = req.body.skillsOfInterest !== undefined ? req.body.skillsOfInterest : user.skillsOfInterest;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      dateOfBirth: updatedUser.dateOfBirth,
      avatar: updatedUser.avatar,
      schoolName: updatedUser.schoolName,
      interests: updatedUser.interests,
      aboutMe: updatedUser.aboutMe,
      collegeName: updatedUser.collegeName,
      industry: updatedUser.industry,
      professionalSkills: updatedUser.professionalSkills,
      skillsOfInterest: updatedUser.skillsOfInterest,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload user avatar
// @route   PUT /api/users/profile/avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the relative path
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/users/dashboard-stats
export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Performance Data (Interest XP)
    const performanceData = Array.from(user.interestXp.entries()).map(([subject, score]) => ({
      subject,
      score
    }));

    // Ensure we have some default subjects if empty
    if (performanceData.length === 0) {
      ['Environmental Studies', 'Mathematics', 'Physics', 'Chemistry'].forEach(s => {
        performanceData.push({ subject: s, score: 0 });
      });
    }

    // 2. Activity Mix (Counts)
    const [missionsCount, quizzesCount, materialsCount] = await Promise.all([
      Submission.countDocuments({ userId: req.user._id, status: 'Approved' }),
      QuizResult.countDocuments({ userId: req.user._id }),
      Material.countDocuments()
    ]);

    const activityData = [
      { name: 'Quizzes', value: quizzesCount },
      { name: 'Missions', value: missionsCount },
      { name: 'Materials', value: materialsCount },
    ];

    // 3. Skill Matrix (Derived)
    const skillMatrix = [
      { subject: 'Theory', A: Math.min(user.eduXp / 10, 100), fullMark: 100 },
      { subject: 'Practical', A: Math.min(user.ecoXp / 10, 100), fullMark: 100 },
      { subject: 'Consistency', A: Math.min(user.streak * 10, 100), fullMark: 100 },
      { subject: 'Innovation', A: 75, fullMark: 100 }, // Static/Fallback
      { subject: 'Impact', A: Math.min((user.ecoXp + user.eduXp) / 20, 100), fullMark: 100 },
    ];

    // 4. Global Standings (Top 5)
    const leaderboard = await User.find({ role: 'Student' })
      .select('name xp level avatar')
      .sort({ xp: -1 })
      .limit(5);

    res.json({
      performanceData,
      activityData,
      skillMatrix,
      leaderboard,
      streak: user.streak,
      points: user.xp,
      level: user.level,
      nextLevelXP: user.level * 1000
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
