import Submission from '../models/Submission.js';
import User from '../models/User.js';
import Mission from '../models/Mission.js';

// @desc    User submits a mission
// @route   POST /api/submissions
export const createSubmission = async (req, res) => {
  const { missionId, description } = req.body;
  const userId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image proof' });
  }

  try {
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Convert backslashes to forward slashes for URL compatibility
    const imagePath = req.file.path.replace(/\\/g, '/');

    const submission = await Submission.create({
      userId,
      missionId,
      image: imagePath,
      description,
      status: 'Pending'
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all submissions (Teacher/Admin only)
// @route   GET /api/submissions
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ status: 'Pending' })
      .populate('userId', 'name email avatar')
      .populate('missionId', 'title points description')
      .sort('-createdAt');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's submissions
// @route   GET /api/submissions/my-submissions
export const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const submissions = await Submission.find({ userId }).populate('missionId', 'title points');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject submission (Admin/Teacher only)
// @route   PUT /api/submissions/:id
export const updateSubmissionStatus = async (req, res) => {
  const { status, remarks } = req.body;
  const { id } = req.params;

  try {
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Only update if status is actually changing and not already approved
    if (status === 'Approved' && submission.status !== 'Approved') {
      const user = await User.findById(submission.userId);
      const mission = await Mission.findById(submission.missionId);
      
      user.xp += mission.points;
      user.ecoXp += mission.points;
      
      // Level up logic (500 XP per level)
      const newLevel = Math.floor(user.xp / 500) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
      }
      
      // Award badge if not already exist
      if (!user.badges.includes(mission.title)) {
          user.badges.push(mission.title);
      }

      await user.save();

      // TEACHER REWARDS
      if (req.user.role === 'Teacher') {
        const teacher = await User.findById(req.user._id);
        teacher.xp += 10; // 10 XP per mission approved

        // Teacher Milestone: Master Mentor
        const approvedCount = await Submission.countDocuments({ 
          approvedBy: teacher._id, 
          status: 'Approved' 
        });

        if (approvedCount >= 10 && !teacher.badges.includes('Master Mentor')) {
          teacher.badges.push('Master Mentor');
        }

        // Teacher Level up logic
        const tLevel = Math.floor(teacher.xp / 500) + 1;
        if (tLevel > teacher.level) {
          teacher.level = tLevel;
        }

        await teacher.save();
        submission.approvedBy = teacher._id;
      }
    }

    submission.status = status || submission.status;
    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
