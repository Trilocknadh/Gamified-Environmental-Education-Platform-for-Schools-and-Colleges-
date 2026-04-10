import Material from '../models/Material.js';

// @desc    Get all materials with filters
// @route   GET /api/materials
export const getMaterials = async (req, res) => {
  const { gradeLevel, subject, type, category } = req.query;
  const filter = {};

  if (gradeLevel) filter.gradeLevel = gradeLevel;
  if (subject) filter.subject = subject;
  if (type) filter.type = type;
  if (category) filter.category = category;

  try {
    const materials = await Material.find(filter).sort('-createdAt');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new material
// @route   POST /api/materials
export const createMaterial = async (req, res) => {
  try {
    const materialData = { ...req.body };

    // Handle file uploads if present
    if (req.files) {
      if (req.files.file && req.files.file[0]) {
        materialData.url = `/uploads/${req.files.file[0].filename}`;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        materialData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }
    }

    const material = await Material.create({
      ...materialData,
      createdBy: req.user._id
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    if (material.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    if (material.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await material.deleteOne();
    res.json({ message: 'Material removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
