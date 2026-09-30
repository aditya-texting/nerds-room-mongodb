import mongoose from 'mongoose';
const ApplicationFileSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.ApplicationFile || mongoose.model('ApplicationFile', ApplicationFileSchema);