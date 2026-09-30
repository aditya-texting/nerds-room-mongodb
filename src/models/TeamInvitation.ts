import mongoose from 'mongoose';
const TeamInvitationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED'], required: true },
  expiresAt: { type: Date, required: true },
  acceptedAt: { type: Date }
}, { timestamps: true });
export default mongoose.models.TeamInvitation || mongoose.model('TeamInvitation', TeamInvitationSchema);