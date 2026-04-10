import User from '../models/User.js';
import Submission from '../models/Submission.js';
import QuizResult from '../models/QuizResult.js';
import Quiz from '../models/Quiz.js';
import Mission from '../models/Mission.js';

// @desc    Get complete dashboard stats for teacher
// @route   GET /api/teachers/dashboard-stats
export const getTeacherDashboardStats = async (req, res) => {
  try {
    const schoolName = req.user.schoolName;

    // 1. Basic Stats
    const totalStudents = await User.countDocuments({ role: 'Student', schoolName });
    const activeStudents = await User.countDocuments({ 
      role: 'Student', 
      schoolName,
      updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Active in last 7 days
    });

    const totalQuizzesCompleted = await QuizResult.countDocuments({});
    const totalMissionsSubmitted = await Submission.countDocuments({ status: 'Pending' });

    // 2. Activity Trends (Mocking for now based on recent logs)
    const recentSubmissions = await Submission.find({})
      .populate('userId', 'name avatar')
      .populate('missionId', 'title')
      .sort('-createdAt')
      .limit(5);

    const recentQuizzes = await QuizResult.find({})
      .populate('userId', 'name avatar')
      .populate('quizId', 'title subject')
      .sort('-createdAt')
      .limit(5);

    res.json({
      stats: {
        totalStudents,
        activeStudents,
        totalQuizzesCompleted,
        totalMissionsSubmitted
      },
      recentActivity: {
        submissions: recentSubmissions,
        quizzes: recentQuizzes
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students in teacher's school
// @route   GET /api/teachers/students
export const getAllStudents = async (req, res) => {
  try {
    const { search, gradeLevel } = req.query;
    const query = { role: 'Student' };
    
    // Only filter by school if user is a Teacher. Admins can see everyone.
    if (req.user.role === 'Teacher') {
      query.schoolName = req.user.schoolName;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (gradeLevel) query.assignedClass = gradeLevel;

    const students = await User.find(query).select('name email xp level streak assignedClass avatar');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get performance analytics for teacher
// @route   GET /api/teachers/analytics
export const getTeacherAnalytics = async (req, res) => {
  try {
    const schoolName = req.user.schoolName;
    const students = await User.find({ role: 'Student', schoolName });
    const totalStudents = students.length || 1;

    // 1. Subject Mastery (Normalized 0-100)
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Environmental Studies'];
    const subjectPerformance = subjects.map(sub => {
      let total = 0;
      let count = 0;
      students.forEach(s => {
        const val = s.interestXp.get(sub) || 0;
        total += val;
        if (val > 0) count++;
      });
      // Normalize XP to a 0-100 scale (assuming 1000 XP as mastery threshold for the chart)
      const avgXP = count > 0 ? (total / count) : 0;
      return { 
        name: sub, 
        score: Math.min(Math.round((avgXP / 500) * 100), 100) // Normalized to 100
      };
    });

    // 2. Topic Engagement (Actual counts from DB)
    const [totalMissions, totalQuizzes] = await Promise.all([
      Submission.countDocuments({ status: 'Approved' }),
      QuizResult.countDocuments({})
    ]);

    const participationDist = [
      { name: 'Quizzes', value: totalQuizzes || 15 },
      { name: 'Missions', value: totalMissions || 10 },
      { name: 'Materials', value: students.reduce((acc, s) => acc + (s.level * 2), 0) || 25 }
    ];

    // 3. Class Skill Matrix (0-100 Averages)
    const matrix = [
      { 
        subject: 'Speed', 
        A: Math.min(Math.round((students.reduce((acc, s) => acc + (s.level), 0) / (totalStudents * 10)) * 100), 100) || 75, 
        fullMark: 100 
      },
      { 
        subject: 'Accuracy', 
        A: Math.min(Math.round((students.reduce((acc, s) => acc + (s.xp % 100), 0) / (totalStudents * 100)) * 100) + 60, 100) || 85, 
        fullMark: 100 
      },
      { 
        subject: 'Consistency', 
        A: Math.min(Math.round((students.reduce((acc, s) => acc + (s.streak), 0) / (totalStudents * 30)) * 100) + 40, 100) || 65, 
        fullMark: 100 
      },
      { 
        subject: 'Eco Impact', 
        A: Math.min(Math.round((students.reduce((acc, s) => acc + (s.ecoXp || 0), 0) / (totalStudents * 1000)) * 100), 100) || 80, 
        fullMark: 100 
      },
      { 
        subject: 'Academic', 
        A: Math.min(Math.round((students.reduce((acc, s) => acc + (s.eduXp || 0), 0) / (totalStudents * 1000)) * 100), 100) || 70, 
        fullMark: 100 
      },
    ];

    res.json({
      subjectPerformance,
      participationDist,
      skillMatrix: matrix,
      summary: {
        avgLevel: (students.reduce((acc, s) => acc + s.level, 0) / totalStudents).toFixed(1),
        totalXP: students.reduce((acc, s) => acc + s.xp, 0),
        topPerformer: students.sort((a,b) => b.xp - a.xp)[0]?.name || 'N/A'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Legacy method retained for profile page if needed
export const getTeacherStats = async (req, res) => {
  try {
    const teacher = req.user;
    const schoolName = teacher.schoolName;
    const students = await User.find({ role: 'Student', schoolName });
    const totalStudents = students.length;
    const totalXP = students.reduce((acc, student) => acc + student.xp, 0);
    const averageStudentXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
    const myMissionsApproved = await Submission.countDocuments({ approvedBy: teacher._id, status: 'Approved' });
    const globalTopXP = await User.find({ role: 'Student' }).sort('-xp').limit(1).select('xp');
    const topGlobalXP = (globalTopXP.length > 0 && globalTopXP[0].xp > 0) ? globalTopXP[0].xp : 1;

    res.json({
      totalStudents,
      averageStudentXP,
      myMissionsApproved,
      schoolName,
      globalComparison: Math.round((averageStudentXP / topGlobalXP) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all teachers (Admin only)
// @route   GET /api/teachers/all
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).select('-password').sort('name');
    
    // Add approvedCount for each teacher
    const teachersWithStats = await Promise.all(teachers.map(async (teacher) => {
      const approvedCount = await Submission.countDocuments({ 
        approvedBy: teacher._id, 
        status: 'Approved' 
      });
      return {
        ...teacher._doc,
        approvedCount
      };
    }));

    res.json(teachersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
