import mongoose from 'mongoose';
const TeamMemberSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['LEADER', 'MEMBER'], required: true },
  status: { type: String, enum: ['ACTIVE', 'LEFT', 'REMOVED'], required: true },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);