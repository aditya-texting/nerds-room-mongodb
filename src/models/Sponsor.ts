import mongoose from 'mongoose';
const SponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  website: { type: String },
  description: { type: String }
}, { timestamps: true });
export default mongoose.models.Sponsor || mongoose.model('Sponsor', SponsorSchema);