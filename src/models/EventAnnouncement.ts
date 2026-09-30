import mongoose from 'mongoose';
const EventAnnouncementSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date }
}, { timestamps: true });
export default mongoose.models.EventAnnouncement || mongoose.model('EventAnnouncement', EventAnnouncementSchema);