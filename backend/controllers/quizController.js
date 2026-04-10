import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import QuizResult from '../models/QuizResult.js';

// @desc    Get quizzes by subject
// @route   GET /api/quizzes
export const getQuizzes = async (req, res) => {
  const { subject, gradeLevel } = req.query;
  const query = {};
  if (subject) query.subject = subject;
  if (gradeLevel) query.gradeLevel = gradeLevel;

  try {
    const quizzes = await Quiz.find(query).sort('-createdAt');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a quiz and reward XP
// @route   POST /api/quizzes/submit
export const submitQuiz = async (req, res) => {
  const { quizId, score } = req.body; // score is 0-1 (percentage)
  const userId = req.user._id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Award XP based on rewardXP * score
    const earnedXP = Math.round(quiz.rewardXP * score);
    
    const user = await User.findById(userId);
    user.xp += earnedXP;
    user.eduXp += earnedXP;
    
    // Update interestXp (Map)
    const currentInterestXp = user.interestXp.get(quiz.subject) || 0;
    user.interestXp.set(quiz.subject, currentInterestXp + earnedXP);

    // Update improvementPoints (Map)
    // If score is low (< 70%), increment improvement points for that subject
    if (score < 0.7) {
      const currentImprovement = user.improvementPoints.get(quiz.subject) || 0;
      user.improvementPoints.set(quiz.subject, currentImprovement + 10);
    }
    
    // Level up logic
    const newLevel = Math.floor(user.xp / 500) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }
    
    await user.save();

    // Save Quiz Result
    await QuizResult.create({
      userId,
      quizId,
      score: Math.round(score * 100), // percentage 0-100
      earnedXP
    });
    
    res.json({ message: 'Quiz submitted!', earnedXP, score: Math.round(score * 100), currentXP: user.xp, currentLevel: user.level });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a quiz
// @route   POST /api/quizzes
export const createQuiz = async (req, res) => {
  const { subject, title, questions, rewardXP, gradeLevel } = req.body;
  try {
    const quiz = await Quiz.create({ 
      subject, 
      title, 
      questions, 
      rewardXP, 
      gradeLevel,
      createdBy: req.user._id 
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized to update this quiz' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all quiz results (for teachers)
// @route   GET /api/quizzes/results
export const getAllQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find()
      .populate('userId', 'name email avatar')
      .populate('quizId', 'title subject')
      .sort('-createdAt');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
