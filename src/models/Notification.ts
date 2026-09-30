import mongoose from 'mongoose';
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['INFO', 'WARNING', 'SUCCESS', 'ERROR'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);