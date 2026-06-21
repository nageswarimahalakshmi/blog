import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const user = await User.findOne({ email: 'elena@example.com' });
    if (!user) {
      console.log('User not found!');
      process.exit(0);
    }
    
    console.log('User found:', user.username, user.email);
    console.log('Password hash in DB:', user.password);
    
    const matches = await bcrypt.compare('password123', user.password);
    console.log('Does password123 match?', matches);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

test();
