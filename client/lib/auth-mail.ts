import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { OtpEmailTemplate } from "@/components/otp-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const onboardingFrom = "Dakshh Team <onboarding@dakshh-hitk.com>";

export async function sendWelcomeEmail(to: string) {
  return resend.emails.send({
    from: onboardingFrom,
    to: [to],
    subject: "Welcome to TechFest Dakshh: Among Us Edition",
    react: EmailTemplate({ email: to }),
  });
}

export async function sendOtpEmail(to: string, otp: string) {
  return resend.emails.send({
    from: onboardingFrom,
    to: [to],
    subject: "Your Dakshh verification OTP",
    react: OtpEmailTemplate({ otp }),
  });
}
