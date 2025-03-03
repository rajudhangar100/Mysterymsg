export const dynamic = "force-dynamic";

//nextjs mai api likhne ke waqt routes ko handle karne ki jarurat nahi hai bcs
//already handled hai, like isme api/sign-up route.ts naam ka api URL hai
import connectDb from "@/lib/connectDb";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

//ye request hume Nextjs hi deta hai, hume user se jo username jaisa data lena hai aur usse database mai rakhna hai
export async function POST(request: Request){
    //to check wheather the request is Post or not 
    // if(request.method!=='POST'){
    //     return Response.json({
    //         success:false,
    //         message:"Invalid Method for this requests"
    //     })
    // }
    await connectDb();
    try{
        const {username,email,password}=await request.json();
        const existingVerifiedUser=await UserModel.findOne({username:username,isVerified:true});
        if(existingVerifiedUser){
            console.log("Username already exits");
            return Response.json({
                success:false,
                message:"Username is already Registered"
            },{
                status:400
            })
        }
        const existingUserbyemail=await UserModel.findOne({email})
        const VerifyCode=Math.floor(100000+Math.random()*900000).toString();
        const VerifyCodeExpiry=new Date();
        VerifyCodeExpiry.setHours(VerifyCodeExpiry.getHours()+1);
        if(existingUserbyemail){
            const userVerifiedByemail=await UserModel.findOne({isVerified:true});
            if(userVerifiedByemail){
                return Response.json({
                    success:false,
                    message:"Email is already Registered"
                },{
                    status:400
                })
            }else{
                // userVerifiedByemail.password=hashedPassword;
                // userVerifiedByemail.VerifyCode=VerifyCode
                const hashedPassword=await bcrypt.hash(password,12);
                
                await UserModel.updateOne({email},{
                    username,
                    password:hashedPassword,
                    VerifyCode,
                    VerifyCodeExpiry:new Date(Date.now()+3600000)
                });
                console.log("User registered but not authorized")
            }
            //we have to send verification email to the user, since email is present in db but not yet verified
            //but also have to update the user with this email since he might have given us new password
        }else{
            const hashedPassword=await bcrypt.hash(password,12);
            const newUser=new UserModel({
                username,
                email,
                password:hashedPassword,
                VerifyCode,
                VerifyCodeExpiry,
                isVerified:false,
                isAcceptingMsg:true,
                messages:[]
            })
            await newUser.save()
            console.log("User Successfully Registered");
        }
        //sending verification email
        const Verificationresponse =  await sendVerificationEmail(email,username,VerifyCode);
        console.log(Verificationresponse.message.toString());
        if(!Verificationresponse.success){
            return Response.json({
                success:false,
                message:Verificationresponse.message.toString()
            },{status:500})
        }
        
        return Response.json({
            success:true,
            message:"User successfully registered , please Verify your email"
        },{status:200})
        
    }catch(error){
        console.error("Error Registering the User",error);
        return Response.json({
            success:false,
            message:"Error Registering the User"
        },
        {
            status:500
        })
    }
}