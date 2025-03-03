export const dynamic = "force-dynamic";

import connectDb from "@/lib/connectDb";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schema/signupSchema";
import { z } from "zod";
//to implement zod library to validate data during runtime

const UserQuerySchema=z.object({
    username:usernameValidation
})

export async function GET(req:Request){
    //check wheather the request is Get or not
    // if(req.method!=='GET'){
    //     return Response.json({
    //         success:false,
    //         message:"Invalid Method for this request"
    //     },{ status:405})
    // }
    await connectDb();
    try {
        //pehele req se URL nikalo and then URL se username as query
        const { searchParams }=new URL(req.url);
        const queryParams ={
            username:searchParams.get('username')
        }
        const result=UserQuerySchema.safeParse(queryParams);
        console.log("This is username's length: ",result.data?.username.length);
        if(!result.success){
            const FormattedError=result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message:FormattedError?.length > 0
                ?FormattedError?.join(", ")
                :"Invalid Query parameters"
            },{status: 500})
        }
        const {username}=result.data;
        const existingVerifiedUser=await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username already taken"
            },{ status:200})
        }
        return Response.json({
            success:true,
            message:"Username is unique"
        },{status: 200})
    } catch (error) {
        console.error("Error, while verifying username ",error);
        return Response.json({
            success:false,
            message:error
        })
    }
    
}