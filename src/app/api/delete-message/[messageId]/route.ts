export const dynamic = "force-dynamic";

import connectDb from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { Authoptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export const DELETE=async (req:Request,{params}:{params:{messageId:string}})=>{
    const msgID=params.messageId as string;
    const session=await getServerSession(Authoptions);
    const user =session?.user;
    if(!session || !user){
        return Response.json({
            success:false,
            message:"User not Authenticated"
        },{ status:401 })
    }
    await connectDb();
    try{
        const updatedUser=await UserModel.updateOne({_id:user.id},{$pull:{messages:{_id:msgID}}})
        if(updatedUser.modifiedCount==0){
            return Response.json({
                success:false,
                message:"Message not found or already deleted"
            },{ status:404 })
        }
        return Response.json({
            success:false,
            message:"Message deleted successfully"
        },{ status:200 })
    }catch(error){
        console.log("Error deleting the messages: ",error);
        return Response.json({
            success:false,
            message:"Error deleting the messages"
        },{ status:500 })
    }
}