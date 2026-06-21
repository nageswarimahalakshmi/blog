import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI env variable is missing.');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing old data...');
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('Old data cleared.');

    // Create Sample Users
    console.log('Creating sample users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const user1 = await User.create({
      username: 'alex_tech',
      email: 'alex@example.com',
      password: passwordHash,
    });

    const user2 = await User.create({
      username: 'elena_design',
      email: 'elena@example.com',
      password: passwordHash,
    });

    const user3 = await User.create({
      username: 'marcus_travels',
      email: 'marcus@example.com',
      password: passwordHash,
    });

    console.log('Users created.');

    // Create Sample Posts
    console.log('Creating sample posts...');
    const post1 = await Post.create({
      title: 'The Future of Web Development in 2026',
      summary: 'An in-depth look at how AI coding agents, Edge Functions, and server-side components are revolutionizing modern web development.',
      content: `## The Modern Web Ecosystem

The landscape of web development is changing faster than ever. In 2026, we are witnessing a paradigm shift where AI coding assistants work hand-in-hand with developers, and static-site generation has merged seamlessly with edge-native rendering.

### Key Trends to Watch:

1. **AI-Assisted Workflows**: Developers are transitioning from syntax authors to system architects, guiding AI tools to generate robust, structured codebases in seconds.
2. **Edge Computing**: Serverless functions are running closer to users, lowering latency and enabling personalized content delivery at scale.
3. **Bespoke Styling**: Utility-first frameworks are seeing competition from modern CSS features like CSS Container Queries, CSS Grid Layout levels, and native glassmorphism filters.

> "The best way to predict the future of web development is to build it with clean, modular principles."

### Conclusion

Embracing these shifts early will define the next generation of full-stack engineering. Keep experimenting and building!`,
      category: 'Technology',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      author: user1._id,
    });

    const post2 = await Post.create({
      title: 'Mastering Glassmorphism & Micro-animations',
      summary: 'Explore best practices for designing sleek, modern glassmorphic layouts and smooth CSS micro-interactions that wow users.',
      content: `## Designing Premium User Experiences

Aesthetics play a critical role in user retention. Modern interfaces should not just be functional—they should feel alive, sleek, and premium. One of the most effective ways to achieve this is through glassmorphism and subtle micro-animations.

### Principles of Premium Design:

* **Frosted Glass Borders**: Use semi-transparent white borders coupled with a strong backdrop-filter blur to establish depth.
* **Harmonious HSL Gradients**: Avoid raw, generic colors. Build tailored palettes that blend smoothly under cards.
* **Micro-interactions**: Let buttons respond dynamically to user hovering. A subtle scale-up or slide transition creates direct visual feedback.

### Example Stylesheet Configuration:
\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.glass-card:hover {
  transform: translateY(-5px);
}
\`\`\`

Designing interactive layouts creates a sensory connection with users. When components feel responsive and polished, the overall application value scales instantly.`,
      category: 'Design',
      coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&auto=format&fit=crop&q=80',
      author: user2._id,
    });

    const post3 = await Post.create({
      title: '10 Underrated Travel Destinations in Europe',
      summary: 'Ditch the crowds of Paris and Rome. Here are ten hidden gems in Europe you must add to your bucket list this year.',
      content: `## Hidden Gems of the Old Continent

Traveling is about discovering the unseen. While major capitals offer history, the lesser-known towns and landscapes of Europe hold the raw, authentic charm of local traditions.

### 1. Mostar, Bosnia & Herzegovina
Known for its stunning iconic bridge (Stari Most) and cobblestone streets, this historic town brings together Ottoman-style architecture and pristine river valleys.

### 2. Sintra, Portugal
Just outside Lisbon, Sintra is a fairy-tale mountainous escape dotted with vibrant palaces, medieval ruins, and mystical gardens.

### 3. Hallstatt, Austria
A breathtaking lakeside village nestled in the Alps. Visit in early spring or winter to experience its snow-capped rooftops with minimal tourist congestion.

> "To travel is to discover that everyone is wrong about other countries." — Aldous Huxley

Get out there and explore the paths less traveled!`,
      category: 'Travel',
      coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80',
      author: user3._id,
    });

    console.log('Posts created.');

    // Create Sample Comments
    console.log('Creating sample comments...');
    await Comment.create({
      content: 'Absolutely agree with the edge computing point! Latency drops significantly.',
      post: post1._id,
      author: user2._id,
    });

    await Comment.create({
      content: 'This list is incredible! Sintra has been on my bucket list for a while now.',
      post: post3._id,
      author: user1._id,
    });

    await Comment.create({
      content: 'The glassmorphic border styling tricks are extremely helpful. Thanks for sharing!',
      post: post2._id,
      author: user3._id,
    });

    await Comment.create({
      content: 'All seeded accounts can log in using the password: password123. Excellent writeups!',
      post: post1._id,
      author: user3._id,
    });

    console.log('Comments created.');
    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
