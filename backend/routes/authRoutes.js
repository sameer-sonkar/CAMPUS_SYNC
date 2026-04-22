const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Student } = require('../models');

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. SIGNUP ROUTE (Generates OTP and Sends Email)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Verification Code
    const verificationCode = generateOTP();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Create unverified student
    const newStudent = new Student({
      uid: crypto.randomUUID(), // Generate custom unique ID
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
      // You can store fullName in a profile map or separate field later
    });

    await newStudent.save();

    // Send Verification Email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"Campus Sync" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Campus Sync Verification Code',
        html: `<h2>Welcome to Campus Sync!</h2>
               <p>Your verification code is: <strong>${verificationCode}</strong></p>
               <p>This code will expire in 10 minutes.</p>`,
      });
    } else {
      // Fallback for testing if EMAIL_USER is not provided
      console.log(`[TEST MODE] Verification Code for ${email} is: ${verificationCode}`);
    }

    res.status(201).json({ message: 'Signup successful. Please check your email for the verification code.', email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. VERIFY ROUTE (Validates OTP)
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'User not found' });
    if (student.isVerified) return res.status(400).json({ error: 'User is already verified' });

    // Validate Code
    if (student.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    if (student.verificationCodeExpires < new Date()) {
      return res.status(400).json({ error: 'Verification code expired. Please sign up again.' });
    }

    // Mark as verified
    student.isVerified = true;
    student.verificationCode = undefined;
    student.verificationCodeExpires = undefined;
    await student.save();

    // Generate JWT Token
    const token = jwt.sign({ uid: student.uid }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });

    res.json({ message: 'Email successfully verified!', token, uid: student.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. LOGIN ROUTE (Validates Password and returns JWT)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'User not found' });

    // Check if verified
    if (!student.isVerified) return res.status(403).json({ error: 'Please verify your email first' });

    // Validate Password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Fix for legacy users: if they don't have a uid, generate one
    if (!student.uid) {
      student.uid = crypto.randomUUID();
      await student.save();
    }

    // Generate JWT Token
    const token = jwt.sign({ uid: student.uid }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, uid: student.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. FORGOT PASSWORD ROUTE
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'User not found' });

    const resetCode = generateOTP();
    student.resetPasswordToken = resetCode;
    student.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await student.save();

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"Campus Sync" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `<h2>Password Reset</h2>
               <p>Your password reset code is: <strong>${resetCode}</strong></p>
               <p>This code will expire in 10 minutes.</p>`,
      });
    } else {
      console.log(`[TEST MODE] Reset Code for ${email} is: ${resetCode}`);
    }

    res.json({ message: 'Password reset code sent to email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. RESET PASSWORD ROUTE
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const student = await Student.findOne({ email });
    
    if (!student) return res.status(404).json({ error: 'User not found' });
    if (student.resetPasswordToken !== code) return res.status(400).json({ error: 'Invalid reset code' });
    if (student.resetPasswordExpires < new Date()) return res.status(400).json({ error: 'Reset code has expired' });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;
    await student.save();

    res.json({ message: 'Password has been successfully reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
