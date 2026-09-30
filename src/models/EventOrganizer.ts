import mongoose from 'mongoose';
const EventOrganizerSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['OWNER', 'ADMIN', 'EDITOR', 'MODERATOR'], required: true }
}, { timestamps: true });
export default mongoose.models.EventOrganizer || mongoose.model('EventOrganizer', EventOrganizerSchema);