import VerificationsEmailTemplate from "@/emails/VerificationEmailTemplate";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
) : Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify Email',
            react: VerificationsEmailTemplate({username, otp: verifyCode})
        })

        return {success: false, message: "Verification email sent successfully"}

    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {success: false, message: "Failed to send verification email"}
    }
}
