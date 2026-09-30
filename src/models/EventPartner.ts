import mongoose from 'mongoose';
const EventPartnerSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  partnerType: { type: String, enum: ['TECHNOLOGY', 'COMMUNITY', 'MEDIA', 'ECOSYSTEM', 'VENUE', 'OTHER'], required: true },
  displayOrder: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.EventPartner || mongoose.model('EventPartner', EventPartnerSchema);