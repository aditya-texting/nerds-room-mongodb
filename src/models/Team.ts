import mongoose from 'mongoose';
const TeamSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  joinCode: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  minMembers: { type: Number, required: true },
  maxMembers: { type: Number, required: true },
  status: { type: String, enum: ['OPEN', 'FULL', 'LOCKED', 'CANCELLED'], required: true }
}, { timestamps: true });
export default mongoose.models.Team || mongoose.model('Team', TeamSchema);