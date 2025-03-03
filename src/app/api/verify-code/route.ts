export const dynamic = "force-dynamic";

import connectDb from "@/lib/connectDb";
import UserModel from "@/models/User";
import { z } from "zod";
import { verifySchema } from "@/schema/verifySchema";
import { Verify } from "crypto";

//z.object({}) is a method/function which takes object as param
// const UserQuerySchema=z.object({
//     VerifyCode:verifySchema
// })

export async function POST(req:Request) {
    await connectDb();
    try {
        const { username,code }=await req.json();//it means we're(client) sending data in terms of json 

        const decodedUsername=decodeURIComponent(username);
        // const otp=UserQuerySchema.safeParse(verifycode);//to check the format of otp

        const user=await UserModel.findOne({username:decodedUsername});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:500})
        }
        // console.log("expiry date: ",user.VerifyCodeExpiry);
        const isCodeExpired= new Date()<new Date(user.VerifyCodeExpiry);
        if(!isCodeExpired){
            return Response.json({
                success:false,
                message:"Verification Code is expired"
            },{status:500})
        }
        // const code=otp.data?.VerifyCode.code;
        // console.log(otp);
        console.log("OTPs are ",code,"  ",user.VerifyCode);
        if(code!==user.VerifyCode){
            return Response.json({
                success:false,
                message:"Incorrect Verification code"
            },{status:400})
        }
        user.isVerified=true;
        await user.save();
        return Response.json({
            success:true,
            message:"User successfully verified"
        },{ status:200})

    } catch (error) {
        console.error("Error checking code ",error);
        return Response.json({
            success:false,
            message:"Error checking code"
        },{status:500})
    }
}