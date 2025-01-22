const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registration route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Profile route - Get user profile
router.get('/profile', async (req, res) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Extract user ID from the token

    // Query MongoDB to get the user data by ID
    const user = await User.findById(userId).select('name email mobile'); // Select necessary fields (name, email, mobile)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data back as a response
    res.json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,  // Assuming the "mobile" field exists in your User model
    });
  } catch (err) {
    console.error('Error verifying token or fetching user:', err);
    res.status(400).json({ message: 'Invalid token or user not found' });
  }
});

module.exports = router;
