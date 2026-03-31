import type { Request, Response } from 'express';
import type {
  RegisterRequestBody,
  LoginRequestBody,
  IUserDocument,
  UserResponse,
} from '../interfaces/user.interface.js';

import User from '../models/User.js';
import jwtPkg from 'jsonwebtoken';

const jwt = jwtPkg as typeof import('jsonwebtoken');

// ================= REGISTER =================
export const registerUser = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, role, age } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Please fill all required fields' });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user: IUserDocument = await User.create({
      username,
      email,
      password,
      role: role || 'user',
      age: age || null,
    });

    res.status(201).json({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      age: user.age,
    });
  } catch (error) {
    console.error('Register Error 👉', error);
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

    console.log("BODY:", req.body);

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required' });
      return;
    }

    const user = await User.findOne({ email });

    console.log("USER:", user);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // ✅ MUST EXIST
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // console.log("SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: user._id.toString(),
        name: user.username,
        admin: user.role === 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      age: user.age,
      token,
    });

  } catch (error) {
    console.error('Login Error 👉', error);
    res.status(500).json({ message: 'Server error' });
  }
};