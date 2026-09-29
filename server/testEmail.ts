import "dotenv/config";
import sendEmail from "./utils/sendEmail.ts";
import { verificationEmailTemplate } from "./utils/emailTemplates.ts";

const testEmail = async () => {
  try {
    console.log("Sending test email...");
    await sendEmail({
      to: process.env.SMTP_USER!, // sends to yourself
      subject: "HomiePlace — Test Email",
      html: verificationEmailTemplate("Test User", "123456"),
    });
    console.log("✅ Email sent successfully! Check your inbox.");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

testEmail();
