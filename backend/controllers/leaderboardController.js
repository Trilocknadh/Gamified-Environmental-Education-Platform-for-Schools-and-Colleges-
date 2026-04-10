import User from '../models/User.js';

// @desc    Get top users by XP
// @route   GET /api/leaderboard
// @desc    Get top users by XP (Global, Eco, Edu, Interests, Improvement)
// @route   GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { type } = req.query;
    let sortField = 'xp';
    let selectFields = 'name xp level badges avatar';

    if (type === 'eco') {
      sortField = 'ecoXp';
      selectFields += ' ecoXp';
    } else if (type === 'edu') {
      sortField = 'eduXp';
      selectFields += ' eduXp';
    } else if (type === 'interest') {
      sortField = 'interestXp'; // This will sort by the overall Map, which might not be perfect. 
      // For interest, we might want to sum up all interest XP or just show a list.
      // But let's assume we want to show users with most diverse/highest interest points.
      // Actually, sorting by a Map in MongoDB is tricky. 
      // Let's just return top users and we'll process special fields if needed.
    } else if (type === 'improvement') {
      sortField = 'improvementPoints';
    }

    const topUsers = await User.find({ role: 'Student' })
      .select(selectFields + ' interestXp improvementPoints')
      .sort({ [sortField]: -1 })
      .limit(10);
    
    // Process the data to include the relevant score for the frontend
    const users = topUsers.map(u => ({
      ...u._doc,
      score: u[sortField] || 0,
      displayScore: type === 'interest' ? Array.from(u.interestXp.values()).reduce((a, b) => a + b, 0) : (u[sortField] || 0)
    }));

    if (type === 'interest') {
      users.sort((a, b) => b.displayScore - a.displayScore);
    } else if (type === 'improvement') {
      users.sort((a, b) => b.displayScore - a.displayScore);
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's rank
// @route   GET /api/leaderboard/rank
export const getMyRank = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    let sortField = 'xp';
    let score = user.xp;

    if (type === 'eco') {
      sortField = 'ecoXp';
      score = user.ecoXp;
    } else if (type === 'edu') {
      sortField = 'eduXp';
      score = user.eduXp;
    } else if (type === 'interest') {
       score = Array.from(user.interestXp.values()).reduce((a, b) => a + b, 0);
    } else if (type === 'improvement') {
       score = Array.from(user.improvementPoints.values()).reduce((a, b) => a + b, 0);
    }
    
    const rank = await User.countDocuments({ 
      role: 'Student', 
      [sortField]: { $gt: score } 
    }) + 1;
    
    res.json({ rank, name: user.name, xp: user.xp, ecoXp: user.ecoXp, eduXp: user.eduXp, level: user.level, interestXp: user.interestXp, improvementPoints: user.improvementPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Reset all student leaderboard points (Admin/Teacher only)
// @route   POST /api/leaderboard/reset
export const resetLeaderboard = async (req, res) => {
  try {
    // In a real app, you might archive this data first
    await User.updateMany(
      { role: 'Student' },
      { 
        $set: { 
          xp: 0, 
          ecoXp: 0, 
          eduXp: 0, 
          interestXp: {}, 
          improvementPoints: {},
          streak: 0,
          level: 1
        } 
      }
    );
    res.json({ message: 'Leaderboard has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
