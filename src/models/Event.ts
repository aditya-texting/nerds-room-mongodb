import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  coverImageUrl: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  locationType: { 
    type: String, 
    enum: ['ONLINE', 'OFFLINE', 'HYBRID'], 
    required: true 
  },
  locationName: { type: String },
  locationAddress: { type: String },
  locationUrl: { type: String },
  participationType: { 
    type: String, 
    enum: ['INDIVIDUAL', 'TEAM', 'BOTH'], 
    required: true 
  },
  minTeamSize: { type: Number },
  maxTeamSize: { type: Number },
  status: { 
    type: String, 
    enum: ['DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED'], 
    required: true 
  },
  isFeatured: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
