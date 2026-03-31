import type { Request, Response } from 'express';
import type {
  RegisterRequestBody,
  LoginRequestBody,
  IUserDocument,
  UserResponse,
} from '../interfaces/user.interface.js';

import User from '../models/User.js';

// ✅ FIX: Proper import for ESM + TS
import jwt from 'jsonwebtoken';

// ================= REGISTER =================
export const registerUser = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, role, age } = req.body;

    // Validation
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Please fill all required fields' });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user
    const user: IUserDocument = await User.create({
      username,
      email,
      password,
      role: role || 'user',
      age: age || null,
    });

    const responseData: UserResponse = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      age: user.age,
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= LOGIN =================
export const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // ✅ IMPORTANT: Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Generate Token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        name: user.username,
        admin: user.role === 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const responseData: UserResponse = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      age: user.age,
      token,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};