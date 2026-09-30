import mongoose from 'mongoose';
const EventTimelineSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  sortOrder: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.EventTimeline || mongoose.model('EventTimeline', EventTimelineSchema);