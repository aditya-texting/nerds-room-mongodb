import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/nerdsrom-platform';

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  await initDB();

  return cached.conn;
}

async function initDB() {
  // Check and create admin user if not exists
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: String,
    role: String,
    passwordHash: String,
    name: String,
    userType: String,
    status: String,
    emailVerified: Boolean,
  }, { strict: false })); // Use strict: false temporarily just in case model isn't fully loaded

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    const adminExists = await User.findOne({ role: 'ADMIN' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);
      
      await User.create({
        email: adminEmail,
        passwordHash: passwordHash,
        role: 'ADMIN',
        name: 'Admin User',
        userType: 'OTHER',
        status: 'ACTIVE',
        emailVerified: true
      });
      console.log('Initial admin user created successfully.');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
}

export default connectToDatabase;
