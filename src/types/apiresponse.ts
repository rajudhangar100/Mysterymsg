import { Message } from "@/models/User";
//response which we're going to send to the user    
export interface Apiresponse{
    success:boolean;
    message:string;
    isAcceptingMsg?:boolean;
    messages?:Array<Message>;
}