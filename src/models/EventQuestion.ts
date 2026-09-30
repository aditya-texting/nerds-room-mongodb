import mongoose from 'mongoose';
const EventQuestionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String },
  status: { type: String, enum: ['OPEN', 'ANSWERED', 'REJECTED'], required: true },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export default mongoose.models.EventQuestion || mongoose.model('EventQuestion', EventQuestionSchema);