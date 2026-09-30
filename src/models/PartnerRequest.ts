import mongoose from 'mongoose';
const PartnerRequestSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: { type: String, required: true },
  organisationName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  partnershipType: { type: String, enum: ['TECHNOLOGY', 'COMMUNITY', 'MEDIA', 'ECOSYSTEM', 'VENUE', 'OTHER'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'CONTACTED', 'IN_DISCUSSION', 'APPROVED', 'REJECTED'], required: true }
}, { timestamps: true });
export default mongoose.models.PartnerRequest || mongoose.model('PartnerRequest', PartnerRequestSchema);