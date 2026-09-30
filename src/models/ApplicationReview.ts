import mongoose from 'mongoose';
const ApplicationReviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String }
}, { timestamps: true });
export default mongoose.models.ApplicationReview || mongoose.model('ApplicationReview', ApplicationReviewSchema);