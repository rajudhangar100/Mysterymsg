import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/verificationemailtemp"
import { Apiresponse } from "@/types/apiresponse"

//params and return type
export async function sendVerificationEmail(
    email:string,
    username:string,
    VerifyCode:string
): Promise<Apiresponse>{
    try {
        const {data , error} = await resend.emails.send({
            from: 'Mystery <onboarding@resend.dev>',
            to: [email],
            subject: 'Mystery message | Verification Code',
            react: VerificationEmail({username,otp:VerifyCode})
          });      
        if(error){
            console.error(error);
            return {    success:false,message:error.toString() }
        }else{
            return {    success: true, message:"Response Success" };
        }
    } catch (error) {
        console.error("Error Sending Verification Email ",error);
        return {    success:false , message:"Response Failed" };
    }
    
}

