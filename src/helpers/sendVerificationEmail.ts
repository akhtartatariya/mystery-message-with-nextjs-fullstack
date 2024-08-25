// import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from 'nodemailer';
import { render } from "@react-email/components";
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // await resend.emails.send({
        //     from: 'onboarding@resend.dev',
        //     to: email,
        //     subject: 'Mystery Message Verification Code', 
        //     react: VerificationEmail({ username, otp: verifyCode }),
        // });

        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });
        const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));
        const options = {
            from: 'mystery-message@mail.dev',
            to: email,
            subject: 'Mystery Message Verification Code',
            html: emailHtml,
        };

        await transporter.sendMail(options);
        return { success: true, message: "Verification Email send successfully" }

    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}