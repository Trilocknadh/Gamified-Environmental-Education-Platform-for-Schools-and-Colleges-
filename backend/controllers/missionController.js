import Mission from '../models/Mission.js';
import Submission from '../models/Submission.js';

// @desc    Get all missions
// @route   GET /api/missions
export const getMissions = async (req, res) => {
  try {
    let missions = await Mission.find({}).sort('-createdAt').lean();

    // If student, check for approved submissions
    if (req.user && req.user.role === 'Student') {
      const submissions = await Submission.find({ userId: req.user._id, status: 'Approved' });
      missions = missions.map(mission => ({
        ...mission,
        completed: submissions.some(s => s.missionId.toString() === mission._id.toString())
      }));
    }

    res.json(missions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a mission
// @route   POST /api/missions
export const createMission = async (req, res) => {
  const { title, description, points, rewardXP, difficulty, type, gradeLevel } = req.body;

  try {
    const mission = await Mission.create({ 
      title, 
      description, 
      points: points || rewardXP || 50, 
      rewardXP: rewardXP || points || 100,
      difficulty: difficulty || 'Intermediate',
      type: type || 'Eco Action',
      gradeLevel: gradeLevel || '10',
      createdBy: req.user._id 
    });
    res.status(201).json(mission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a mission
// @route   PUT /api/missions/:id
export const updateMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: 'Mission not found' });

    if (mission.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedMission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a mission
// @route   DELETE /api/missions/:id
export const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: 'Mission not found' });

    if (mission.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await mission.deleteOne();
    res.json({ message: 'Mission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
