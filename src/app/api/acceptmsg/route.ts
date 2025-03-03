export const dynamic = "force-dynamic";

import connectDb from "@/lib/connectDb";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { Authoptions } from "../auth/[...nextauth]/options";

export async function POST(req:Request){
    const session = await getServerSession(Authoptions);//provides a session using authoptions as credential provider
    const user=session?.user;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"User not Authenticated"
        },{ status:401 })
    }
    const id = user?.id;
    await connectDb();
    const { isAcceptingMsg }=await req.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id,{isAcceptingMsg},{new:true});
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Error updating the status of User"
            },{ status:401 })
        }
        return Response.json({
            success:true,
            message:"User Status updated successfully",
            updatedUser
        },{ status:200 })
    } catch (error) {   
        console.error("Error: ",error);
        return Response.json({
            success:false,
            message:"Error updating the status of User"
        },{ status:500 })
    }
}

export async function GET(req:Request){
    const session= await getServerSession(Authoptions);
    const user = session?.user;
    if(!user){
        return Response.json({
            success:false,
            message:"User not Authenticated"
        },{ status:400 })
    }
    const userId=user.id;
    await connectDb();
    try{
        const foundUser=await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
                },{ status:500 })
        }
        return Response.json({
            success:true,
            isAcceptingMsg:foundUser.isAcceptingMsg
        },{ status:200 })
    }catch(error){
        console.error("Error: ",error);
        return Response.json({
            success:false,
            message:"Error checking the status of User"
        },{ status:500 })
    }
}