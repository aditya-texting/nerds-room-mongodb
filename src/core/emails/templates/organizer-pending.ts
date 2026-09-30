export const getOrganizerPendingTemplate = (name: string, logoUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="NerdsRoom Logo" style="max-width: 150px;" />
      </div>
      <h2 style="color: #333;">Welcome to NerdsRoom, ${name}!</h2>
      <p style="color: #555; font-size: 16px;">
        Thank you for registering as an Organizer on NerdsRoom.
      </p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #8cc63f; margin: 20px 0;">
        <strong>Status Update:</strong> Your request has been reviewed and we will reply within 24-48 hours.
      </div>
      <p style="color: #555; font-size: 14px;">
        Our admin team is currently reviewing your application to ensure the best experience for our community. Once approved, you will be able to access your Organizer Dashboard.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} NerdsRoom. All rights reserved.
      </p>
    </div>
  `;
};
