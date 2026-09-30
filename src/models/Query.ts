import mongoose from 'mongoose';
const QuerySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, enum: ['GENERAL', 'EVENT', 'TECHNICAL', 'SPONSORSHIP', 'PARTNERSHIP', 'PAYMENT', 'OTHER'], required: true },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export default mongoose.models.Query || mongoose.model('Query', QuerySchema);