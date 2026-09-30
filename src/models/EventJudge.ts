import mongoose from 'mongoose';
const EventJudgeSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String },
  designation: { type: String }
}, { timestamps: true });
export default mongoose.models.EventJudge || mongoose.model('EventJudge', EventJudgeSchema);