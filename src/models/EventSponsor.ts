import mongoose from 'mongoose';
const EventSponsorSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor', required: true },
  sponsorshipTier: { type: String, required: true },
  displayOrder: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.EventSponsor || mongoose.model('EventSponsor', EventSponsorSchema);