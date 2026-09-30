import mongoose from 'mongoose';
const TeamRegistrationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED', 'CONFIRMED', 'CANCELLED'], required: true },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.models.TeamRegistration || mongoose.model('TeamRegistration', TeamRegistrationSchema);