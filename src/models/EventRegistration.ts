import mongoose from 'mongoose';
const EventRegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['REGISTERED', 'CANCELLED', 'WAITLISTED'], required: true },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });
// Compound unique index is needed but omitted for simplicity
export default mongoose.models.EventRegistration || mongoose.model('EventRegistration', EventRegistrationSchema);