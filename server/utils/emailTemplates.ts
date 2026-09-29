export const verificationEmailTemplate = (name: string, token: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Welcome to HomiePlace!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering. Use the verification code below to verify your email address:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${token}</span>
      </div>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">— The HomiePlace Team</p>
    </div>
  `;
};
