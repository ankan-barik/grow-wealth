const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expensia')
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Enhanced User Schema with password reset fields
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'salary', 'freelance', 'investments', 'other_income',
      'rent', 'groceries', 'utilities', 'entertainment', 
      'transportation', 'dining', 'shopping', 'healthcare', 
      'education', 'travel', 'personal', 'other_expense'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Fixed Email Configuration
const createEmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured');
    return null;
  }

  console.log('📧 Configuring email with:', process.env.EMAIL_USER);

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Enhanced email sending function
const sendPasswordResetEmail = async (userEmail, resetToken, userName) => {
  try {
    console.log('📧 Attempting to send email to:', userEmail);
    
    const transporter = createEmailTransporter();
    if (!transporter) {
      throw new Error('Email service not configured');
    }

    console.log('🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Expensia Support" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Password Reset Request - Expensia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Expensia</h1>
            <h2 style="color: #374151; margin: 10px 0;">Password Reset Request</h2>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #374151;">Hello <strong>${userName}</strong>,</p>
            <p style="color: #374151;">We received a request to reset your password for your Expensia account.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block; 
                      font-weight: bold; font-size: 16px;">
              Reset Your Password
            </a>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
          </div>

          <div style="margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              If the button doesn't work, copy and paste this link in your browser:
            </p>
            <p style="word-break: break-all; color: #2563eb; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
              ${resetUrl}
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
              This email was sent from Expensia. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    console.log('📤 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    return true;

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

// Input validation middleware
const validateInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email format' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  
  next();
};

// Transaction validation middleware
const validateTransaction = (req, res, next) => {
  const { amount, category, type, description, date } = req.body;
  
  if (!amount || !category || !type || !description || !date) {
    return res.status(400).json({ 
      message: 'Amount, category, type, description, and date are required' 
    });
  }
  
  if (amount <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than 0' });
  }
  
  const validCategories = [
    'salary', 'freelance', 'investments', 'other_income',
    'rent', 'groceries', 'utilities', 'entertainment', 
    'transportation', 'dining', 'shopping', 'healthcare', 
    'education', 'travel', 'personal', 'other_expense'
  ];
  
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Type must be either income or expense' });
  }
  
  if (!description.trim()) {
    return res.status(400).json({ message: 'Description cannot be empty' });
  }
  
  next();
};

// Register Route
app.post('/api/auth/register', validateInput, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name.trim(),
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login Route
app.post('/api/auth/login', validateInput, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Forgot Password Route
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email format' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        message: 'Email service not configured. Please contact support.' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ 
        message: `If an account with ${email} exists, password reset instructions have been sent.` 
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const emailSent = await sendPasswordResetEmail(email, resetToken, user.name);

    if (emailSent) {
      res.json({ 
        message: `Password reset instructions have been sent to ${email}. Please check your inbox and spam folder.` 
      });
    } else {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      res.status(500).json({ 
        message: 'Failed to send password reset email. Please try again later.' 
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Server error during password reset request.' 
    });
  }
});

// Reset Password Route
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      message: 'Server error during password reset.' 
    });
  }
});

// Transaction Routes

// Get all transactions for authenticated user
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      userId: transaction.userId,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date
    }));

    res.json({
      message: 'Transactions retrieved successfully',
      transactions: formattedTransactions
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
});

// Add new transaction
app.post('/api/transactions', authenticateToken, validateTransaction, async (req, res) => {
  try {
    const { amount, category, type, description, date } = req.body;

    const transaction = new Transaction({
      userId: req.user._id,
      amount: parseFloat(amount),
      category,
      type,
      description: description.trim(),
      date: new Date(date)
    });

    await transaction.save();

    const formattedTransaction = {
      id: transaction._id,
      userId: transaction.userId,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date
    };

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction: formattedTransaction
    });

  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ message: 'Server error while adding transaction' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error while deleting transaction' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  });
});

// Test email configuration
app.get('/api/test-email', async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        message: 'Email credentials not configured',
        details: 'EMAIL_USER and EMAIL_PASS must be set in .env file'
      });
    }

    const transporter = createEmailTransporter();
    if (!transporter) {
      return res.status(500).json({ 
        message: 'Failed to create email transporter'
      });
    }

    await transporter.verify();
    
    res.json({ 
      message: 'Email configuration is working!',
      emailUser: process.env.EMAIL_USER,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({ 
      message: 'Email configuration test failed', 
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🧪 Test email: http://localhost:${PORT}/api/test-email`);
});
