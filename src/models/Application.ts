import mongoose from 'mongoose';
const ApplicationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventRegistrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration' },
  teamRegistrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamRegistration' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  repositoryUrl: { type: String },
  demoUrl: { type: String },
  videoUrl: { type: String },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'REJECTED', 'WINNER'], required: true },
  submittedAt: { type: Date }
}, { timestamps: true });
export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);