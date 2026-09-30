import mongoose from 'mongoose';
const EventLinkSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  linkType: { type: String, enum: ['RULES', 'WEBSITE', 'GITHUB', 'DISCORD', 'WHATSAPP', 'DOCUMENTATION', 'SUBMISSION', 'OTHER'], required: true },
  sortOrder: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.EventLink || mongoose.model('EventLink', EventLinkSchema);