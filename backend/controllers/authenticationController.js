import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, dateOfBirth, role, schoolName, interests, avatar: avatarBody, adminPin } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let hashedPin = undefined;
    if (role === 'Admin') {
      if (!adminPin || adminPin.length !== 6 || isNaN(adminPin)) {
        return res.status(400).json({ message: 'Admin registration requires a 6-digit PIN' });
      }
      hashedPin = await bcrypt.hash(adminPin, salt);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      adminPin: hashedPin,
      dateOfBirth,
      role: role || 'Student',
      schoolName: schoolName || '',
      interests: interests || [],
      avatar: avatarBody || `https://api.dicebear.com/7.x/bottts/svg?seed=${name.replace(/\s+/g, '')}`,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        badges: user.badges,
        avatar: user.avatar,
        schoolName: user.schoolName,
        interests: user.interests,
        aboutMe: user.aboutMe,
        collegeName: user.collegeName,
        industry: user.industry,
        professionalSkills: user.professionalSkills,
        skillsOfInterest: user.skillsOfInterest,
        phoneNumber: user.phoneNumber,
        address: user.address,
        subjectExpertise: user.subjectExpertise,
        yearsOfExperience: user.yearsOfExperience,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password, adminPin } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Admin PIN Check
      if (user.role === 'Admin') {
        if (!adminPin || !(await bcrypt.compare(adminPin, user.adminPin))) {
          return res.status(401).json({ message: 'Invalid Admin Security PIN' });
        }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        badges: user.badges,
        avatar: user.avatar,
        schoolName: user.schoolName,
        interests: user.interests,
        aboutMe: user.aboutMe,
        collegeName: user.collegeName,
        industry: user.industry,
        professionalSkills: user.professionalSkills,
        skillsOfInterest: user.skillsOfInterest,
        phoneNumber: user.phoneNumber,
        address: user.address,
        subjectExpertise: user.subjectExpertise,
        yearsOfExperience: user.yearsOfExperience,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.schoolName = req.body.schoolName !== undefined ? req.body.schoolName : user.schoolName;
    user.interests = req.body.interests !== undefined ? req.body.interests : user.interests;
    user.avatar = req.body.avatar || user.avatar;
    user.aboutMe = req.body.aboutMe !== undefined ? req.body.aboutMe : user.aboutMe;
    user.collegeName = req.body.collegeName !== undefined ? req.body.collegeName : user.collegeName;
    user.industry = req.body.industry !== undefined ? req.body.industry : user.industry;
    user.professionalSkills = req.body.professionalSkills !== undefined ? req.body.professionalSkills : user.professionalSkills;
    user.skillsOfInterest = req.body.skillsOfInterest !== undefined ? req.body.skillsOfInterest : user.skillsOfInterest;
    user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.subjectExpertise = req.body.subjectExpertise !== undefined ? req.body.subjectExpertise : user.subjectExpertise;
    user.yearsOfExperience = req.body.yearsOfExperience !== undefined ? req.body.yearsOfExperience : user.yearsOfExperience;

    // Password Change (Simplified per UI request)
    if (req.body.newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      xp: updatedUser.xp,
      level: updatedUser.level,
      streak: updatedUser.streak,
      badges: updatedUser.badges,
      avatar: updatedUser.avatar,
      schoolName: updatedUser.schoolName,
      interests: updatedUser.interests,
      aboutMe: updatedUser.aboutMe,
      collegeName: updatedUser.collegeName,
      industry: updatedUser.industry,
      professionalSkills: updatedUser.professionalSkills,
      skillsOfInterest: updatedUser.skillsOfInterest,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      subjectExpertise: updatedUser.subjectExpertise,
      yearsOfExperience: updatedUser.yearsOfExperience,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Upload user avatar
// @route   PUT /api/auth/profile/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      user.avatar = fileUrl;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        xp: updatedUser.xp,
        level: updatedUser.level,
        streak: updatedUser.streak,
        badges: updatedUser.badges,
        avatar: updatedUser.avatar,
        schoolName: updatedUser.schoolName,
        interests: updatedUser.interests,
        aboutMe: updatedUser.aboutMe,
        collegeName: updatedUser.collegeName,
        industry: updatedUser.industry,
        professionalSkills: updatedUser.professionalSkills,
        skillsOfInterest: updatedUser.skillsOfInterest,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    res.json({ 
      success: true, 
      message: 'Reset link generated and logged to console',
      resetUrl 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
export const resetPassword = async (req, res) => {
  const { password } = req.body;

  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ success: true, message: 'Password reset successful!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
