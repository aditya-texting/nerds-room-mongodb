import mongoose from 'mongoose';
const EventRegistrationAnswerSchema = new mongoose.Schema({
  registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration', required: true },
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFormField', required: true },
  value: { type: String, required: true }
}, { timestamps: true });
export default mongoose.models.EventRegistrationAnswer || mongoose.model('EventRegistrationAnswer', EventRegistrationAnswerSchema);