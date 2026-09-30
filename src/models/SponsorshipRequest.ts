import mongoose from 'mongoose';
const SponsorshipRequestSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  organisationName: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  sponsorshipType: { type: String, enum: ['MONETARY', 'PRODUCT', 'CREDITS', 'PRIZES', 'SWAG', 'OTHER'], required: true },
  budget: { type: Number },
  message: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'CONTACTED', 'IN_DISCUSSION', 'APPROVED', 'REJECTED'], required: true }
}, { timestamps: true });
export default mongoose.models.SponsorshipRequest || mongoose.model('SponsorshipRequest', SponsorshipRequestSchema);