export const dynamic = "force-dynamic";

import UserModel from "@/models/User";
import connectDb from "@/lib/connectDb";
import { Message } from "@/models/User";//it is for type safety

export async function POST(req:Request){
    await connectDb();
    const { username,content }=await req.json();
    console.log(username,content);
    try{
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{ status:404 })
        }
        if(!user.isAcceptingMsg){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{ status:403 })
        }
        const newMessage={content,createdAt:new Date()};//datatype match hona chahiye,
        user.messages.push(newMessage as Message);
        await user.save();  
        return Response.json({
            success:true,
            message:"Messages Sent successsfully"
        },{ status:200 })
    }catch(error){
        console.error(error);
        return Response.json({
            success:false,
            message:"Error sending the messages"
        },{ status:500 })
    }
}