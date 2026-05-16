// ── Express Server Setup ─────────────────────────────────────────────────────
// Basic Node.js/Express server with RBAC authentication
// Install dependencies: npm install express jsonwebtoken bcryptjs cors helmet

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  authenticateToken,
  requirePermission,
  requireRole,
  errorHandler
} from '../middleware/guards/PermissionMiddleware';
import { User } from '../../database/models/User';
import { TipsterProfile } from '../../database/models/TipsterProfile';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ── Authentication Routes ────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data (without password hash)
    const { passwordHash, ...userData } = user;
    res.json({ ...userData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      role,
      subscriptionStatus: 'free',
      tokenVersion: 1,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create tipster profile if role is tipster
    if (role === 'tipster') {
      await TipsterProfile.create({
        userId: user.id,
        bio: '',
        winRate: 0,
        followers: 0,
        premiumPrice: null,
        verifiedStatus: false,
        totalPredictions: 0,
        successfulPredictions: 0,
        streak: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data
    const { passwordHash: _, ...userData } = user;
    res.status(201).json({ ...userData, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    // Increment token version to invalidate all existing tokens
    if (req.user) {
      await User.incrementTokenVersion(req.user.id);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

app.post('/api/auth/refresh', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Generate new token
    const token = jwt.sign(
      { userId: req.user.id, tokenVersion: req.user.tokenVersion },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userData } = req.user;
    res.json({ ...userData, token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { passwordHash, ...userData } = req.user;
    res.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ── Protected Routes Examples ────────────────────────────────────────────────
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  // Any authenticated user can view their own profile
  const { passwordHash, ...userData } = req.user!;
  res.json(userData);
});

app.get('/api/tipsters/profile', authenticateToken, requirePermission('view_profile'), async (req, res) => {
  // Get tipster profile (could be own or another tipster's)
  const userId = req.query.userId as string || req.user!.id;

  const profile = await TipsterProfile.findByUserId(userId);
  if (!profile) {
    return res.status(404).json({ error: 'Tipster profile not found' });
  }

  res.json(profile);
});

app.post('/api/predictions', authenticateToken, requirePermission('create_predictions'), async (req, res) => {
  // Only tipsters can create predictions
  const { match, prediction, odds } = req.body;

  // Implementation would create prediction in database
  res.json({
    id: 'pred_' + Date.now(),
    tipsterId: req.user!.id,
    match,
    prediction,
    odds,
    createdAt: new Date()
  });
});

app.get('/api/predictions', authenticateToken, requirePermission('view_predictions'), async (req, res) => {
  // Users and tipsters can view predictions
  // Implementation would fetch from database
  res.json([
    {
      id: 'pred_1',
      tipsterId: 'tipster_1',
      match: 'Arsenal vs Chelsea',
      prediction: 'Arsenal to win',
      odds: 2.1,
      createdAt: new Date()
    }
  ]);
});

app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  // Only admins can view all users
  // Implementation would fetch from database
  res.json([
    {
      id: 'user_1',
      email: 'user@example.com',
      role: 'user',
      subscriptionStatus: 'free'
    }
  ]);
});

// ── Error Handling ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Start Server ────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;