import Feedback from '../models/Feedback.js';

// @desc    Submit feedback/query
// @route   POST /api/feedback
export const submitFeedback = async (req, res) => {
  const { subject, message } = req.body;
  const userId = req.user._id;

  try {
    const feedback = await Feedback.create({
      userId,
      subject,
      message,
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get feedback (Teacher/Admin only)
// @route   GET /api/feedback
export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('userId', 'name email').sort('-createdAt');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update feedback status (Teacher/Admin only)
// @route   PATCH /api/feedback/:id
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.status = status;
    await feedback.save();

    const updatedFeedback = await Feedback.findById(req.params.id).populate('userId', 'name email');
    res.json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
