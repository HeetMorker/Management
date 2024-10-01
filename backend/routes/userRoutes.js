const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // JWT protect middleware if needed
const User = require('../models/User'); // Assuming you have a User model

const router = express.Router();

// Update Firebase token route
router.put('/update-token', protect, async (req, res) => {
  const { firebaseToken } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's Firebase token in the database
    user.firebaseToken = firebaseToken;
    await user.save();

    res.status(200).json({ message: 'Firebase token updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Firebase token', error: error.message });
  }
});

module.exports = router;
