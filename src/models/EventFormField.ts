import mongoose from 'mongoose';
const EventFormFieldSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  fieldName: { type: String, required: true },
  fieldType: { type: String, enum: ['TEXT', 'EMAIL', 'NUMBER', 'RADIO', 'CHECKBOX', 'SELECT', 'TEXTAREA', 'LINKEDIN', 'GITHUB'], required: true },
  isRequired: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  order: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.models.EventFormField || mongoose.model('EventFormField', EventFormFieldSchema);