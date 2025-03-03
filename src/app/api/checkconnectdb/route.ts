export const dynamic = "force-dynamic";
import connectDb from "@/lib/connectDb";

export async function GET(req:Request){
    try{
        await connectDb();
        return Response.json({
            success:true,
            message:"hogaya connect"
        },{status: 200})
    }catch(error){
        console.log(error);
        return Response.json({
            success:false,
            message:"nhi hua connect"
        },{status: 500})
    }
}