export const dynamic = "force-dynamic";

import connectDb from "@/lib/connectDb";
import UserModel, { Message } from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { Authoptions } from "../auth/[...nextauth]/options";

export async function GET(req:Request){
    const session = await getServerSession(Authoptions);
    const user=session?.user;
    if(!session || !user){
        return Response.json({
            success:false,
            message:"User not Authenticated"
        },{ status:401 })
    }
    await connectDb();
    const username=user.username;
    try{
        //it return an array,in which 0th element is the object and it has all the messages in it
        const userMsgs=await UserModel.aggregate([
            {$match:{username:username}},//user ko find karo
            {$unwind:'$messages'},//saare messages ko divide kardo
            {$sort:{'messages.createdAt':-1}},//sort them by their creation
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        
        if(!userMsgs || userMsgs.length<=0){
            return Response.json({
                success:true,
                message:"User Messages are empty"
            },{ status:200 })
        }
        return Response.json({
            success:true,
            messages:userMsgs[0].messages as Message[]
        },{ status:200 })
    }catch(error){
        console.log("Error From Getting Msg route: ",error);
        return Response.json({
            success:false,
            message:"Error sending the messages"
        },{ status:500 })
    }
}