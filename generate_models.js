const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src', 'models');
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

const models = {
    'EventFormField': `import mongoose from 'mongoose';
const EventFormFieldSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  fieldName: { type: String, required: true },
  fieldType: { type: String, enum: ['TEXT', 'EMAIL', 'NUMBER', 'RADIO', 'CHECKBOX', 'SELECT', 'TEXTAREA', 'LINKEDIN', 'GITHUB'], required: true },
  isRequired: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  order: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.models.EventFormField || mongoose.model('EventFormField', EventFormFieldSchema);`,

    'EventOrganizer': `import mongoose from 'mongoose';
const EventOrganizerSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['OWNER', 'ADMIN', 'EDITOR', 'MODERATOR'], required: true }
}, { timestamps: true });
export default mongoose.models.EventOrganizer || mongoose.model('EventOrganizer', EventOrganizerSchema);`,

    'EventRegistration': `import mongoose from 'mongoose';
const EventRegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['REGISTERED', 'CANCELLED', 'WAITLISTED'], required: true },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });
// Compound unique index is needed but omitted for simplicity
export default mongoose.models.EventRegistration || mongoose.model('EventRegistration', EventRegistrationSchema);`,

    'EventRegistrationAnswer': `import mongoose from 'mongoose';
const EventRegistrationAnswerSchema = new mongoose.Schema({
  registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration', required: true },
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFormField', required: true },
  value: { type: String, required: true }
}, { timestamps: true });
export default mongoose.models.EventRegistrationAnswer || mongoose.model('EventRegistrationAnswer', EventRegistrationAnswerSchema);`,

    'Team': `import mongoose from 'mongoose';
const TeamSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  joinCode: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  minMembers: { type: Number, required: true },
  maxMembers: { type: Number, required: true },
  status: { type: String, enum: ['OPEN', 'FULL', 'LOCKED', 'CANCELLED'], required: true }
}, { timestamps: true });
export default mongoose.models.Team || mongoose.model('Team', TeamSchema);`,

    'TeamMember': `import mongoose from 'mongoose';
const TeamMemberSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['LEADER', 'MEMBER'], required: true },
  status: { type: String, enum: ['ACTIVE', 'LEFT', 'REMOVED'], required: true },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);`,

    'TeamInvitation': `import mongoose from 'mongoose';
const TeamInvitationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED'], required: true },
  expiresAt: { type: Date, required: true },
  acceptedAt: { type: Date }
}, { timestamps: true });
export default mongoose.models.TeamInvitation || mongoose.model('TeamInvitation', TeamInvitationSchema);`,

    'TeamRegistration': `import mongoose from 'mongoose';
const TeamRegistrationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED', 'CONFIRMED', 'CANCELLED'], required: true },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.models.TeamRegistration || mongoose.model('TeamRegistration', TeamRegistrationSchema);`,

    'Application': `import mongoose from 'mongoose';
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
export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);`,

    'ApplicationFile': `import mongoose from 'mongoose';
const ApplicationFileSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.ApplicationFile || mongoose.model('ApplicationFile', ApplicationFileSchema);`,

    'EventTimeline': `import mongoose from 'mongoose';
const EventTimelineSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  sortOrder: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.EventTimeline || mongoose.model('EventTimeline', EventTimelineSchema);`,

    'EventLink': `import mongoose from 'mongoose';
const EventLinkSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  linkType: { type: String, enum: ['RULES', 'WEBSITE', 'GITHUB', 'DISCORD', 'WHATSAPP', 'DOCUMENTATION', 'SUBMISSION', 'OTHER'], required: true },
  sortOrder: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.EventLink || mongoose.model('EventLink', EventLinkSchema);`,

    'EventAnnouncement': `import mongoose from 'mongoose';
const EventAnnouncementSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date }
}, { timestamps: true });
export default mongoose.models.EventAnnouncement || mongoose.model('EventAnnouncement', EventAnnouncementSchema);`,

    'EventQuestion': `import mongoose from 'mongoose';
const EventQuestionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String },
  status: { type: String, enum: ['OPEN', 'ANSWERED', 'REJECTED'], required: true },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export default mongoose.models.EventQuestion || mongoose.model('EventQuestion', EventQuestionSchema);`,

    'Partner': `import mongoose from 'mongoose';
const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  website: { type: String },
  description: { type: String },
  contactEmail: { type: String }
}, { timestamps: true });
export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);`,

    'EventPartner': `import mongoose from 'mongoose';
const EventPartnerSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  partnerType: { type: String, enum: ['TECHNOLOGY', 'COMMUNITY', 'MEDIA', 'ECOSYSTEM', 'VENUE', 'OTHER'], required: true },
  displayOrder: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.EventPartner || mongoose.model('EventPartner', EventPartnerSchema);`,

    'PartnerRequest': `import mongoose from 'mongoose';
const PartnerRequestSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: { type: String, required: true },
  organisationName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  partnershipType: { type: String, enum: ['TECHNOLOGY', 'COMMUNITY', 'MEDIA', 'ECOSYSTEM', 'VENUE', 'OTHER'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'CONTACTED', 'IN_DISCUSSION', 'APPROVED', 'REJECTED'], required: true }
}, { timestamps: true });
export default mongoose.models.PartnerRequest || mongoose.model('PartnerRequest', PartnerRequestSchema);`,

    'Sponsor': `import mongoose from 'mongoose';
const SponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  website: { type: String },
  description: { type: String }
}, { timestamps: true });
export default mongoose.models.Sponsor || mongoose.model('Sponsor', SponsorSchema);`,

    'EventSponsor': `import mongoose from 'mongoose';
const EventSponsorSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor', required: true },
  sponsorshipTier: { type: String, required: true },
  displayOrder: { type: Number, required: true }
}, { timestamps: true });
export default mongoose.models.EventSponsor || mongoose.model('EventSponsor', EventSponsorSchema);`,

    'SponsorshipRequest': `import mongoose from 'mongoose';
const SponsorshipRequestSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  organisationName: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  sponsorshipType: { type: String, enum: ['MONETARY', 'PRODUCT', 'CREDITS', 'PRIZES', 'SWAG', 'OTHER'], required: true },
  budget: { type: Number },
  message: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'CONTACTED', 'IN_DISCUSSION', 'APPROVED', 'REJECTED'], required: true }
}, { timestamps: true });
export default mongoose.models.SponsorshipRequest || mongoose.model('SponsorshipRequest', SponsorshipRequestSchema);`,

    'Query': `import mongoose from 'mongoose';
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
export default mongoose.models.Query || mongoose.model('Query', QuerySchema);`,

    'EventJudge': `import mongoose from 'mongoose';
const EventJudgeSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String },
  designation: { type: String }
}, { timestamps: true });
export default mongoose.models.EventJudge || mongoose.model('EventJudge', EventJudgeSchema);`,

    'ApplicationReview': `import mongoose from 'mongoose';
const ApplicationReviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String }
}, { timestamps: true });
export default mongoose.models.ApplicationReview || mongoose.model('ApplicationReview', ApplicationReviewSchema);`,

    'Notification': `import mongoose from 'mongoose';
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['INFO', 'WARNING', 'SUCCESS', 'ERROR'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);`
};

for (const name of Object.keys(models)) {
    fs.writeFileSync(path.join(modelsDir, name + '.ts'), models[name]);
}
console.log('Done writing models.');
