import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['COLLEGE_STUDENT', 'WORKING_PROFESSIONAL', 'OTHER'], 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'PARTICIPANT', 'ORGANIZER'], 
    required: true 
  },
  organisationName: { type: String },
  jobRole: { type: String },
  phone: { type: String },
  emailVerified: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'BANNED'], 
    default: 'ACTIVE' 
  },
  resetOtp: { type: String },
  resetOtpExpiry: { type: Date }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
