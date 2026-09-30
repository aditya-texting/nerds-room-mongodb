import mongoose from 'mongoose';
const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  website: { type: String },
  description: { type: String },
  contactEmail: { type: String }
}, { timestamps: true });
export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);