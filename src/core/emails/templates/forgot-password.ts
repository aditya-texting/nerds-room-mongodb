export const getForgotPasswordTemplate = (name: string, otp: string, logoUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP - NerdsRoom</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f5f7;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #0f172a;
      padding: 30px 40px;
      text-align: center;
    }
    .header img {
      max-height: 50px;
      margin-bottom: 0;
    }
    .content {
      padding: 40px;
    }
    h1 {
      color: #0f172a;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 20px;
      font-size: 16px;
    }
    .otp-container {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 30px 0;
    }
    .otp {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #16a34a;
      margin: 0;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 40px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Assuming logoUrl is a complete URL to your dark theme logo -->
      <img src="${logoUrl}" alt="NerdsRoom Logo" />
    </div>
    
    <div class="content">
      <h1>Password Reset Request</h1>
      <p>Hello ${name},</p>
      <p>We received a request to reset the password for your NerdsRoom account. Use the following One-Time Password (OTP) to complete the process:</p>
      
      <div class="otp-container">
        <p style="margin-bottom: 10px; font-size: 14px; color: #475569; font-weight: 600; text-transform: uppercase;">Your OTP Code</p>
        <p class="otp">${otp}</p>
      </div>
      
      <p><strong>This OTP is valid for 10 minutes.</strong></p>
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
      
      <p style="margin-top: 40px;">Best regards,<br><strong>The NerdsRoom Team</strong></p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} NerdsRoom. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
