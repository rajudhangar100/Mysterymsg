import mongoose,{Schema,Document, mongo} from "mongoose";
import { number } from "zod";

//this is our interface datatypes of our typescript
export interface Message extends Document{
    content:string,
    createdAt:Date
}

export interface MessageState{
    content:string,
    createdAt:Date
}

//MessageSchema:Schema<Message> specifies custom datatypes
const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    VerifyCode:string,
    VerifyCodeExpiry:Date,
    isVerified:Boolean,
    isAcceptingMsg:Boolean,
    messages:Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        require:[true,"Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        require:[true,"Email is required"],
        unique:true,
        match:[/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,"Please enter a valid email"]
    },
    password:{
        type:String,
        require:[true,"Password is required"]
    },
    VerifyCode:{
        type:String,
        require:true,
    },
    VerifyCodeExpiry:{
        type:Date,
        required:true,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    isAcceptingMsg:{
        type:Boolean,
        required:true,
        default:true
    },
    messages:[MessageSchema]
})
//<> --> it specifes datatypes as we are using typescript for type safety
// || --> normal backend app mai ek baar application start hogaya tho vo continue hi hota rehta hai
//but nextjs edge framework hai, jaise jaise req aati hai tab tab jaakr db se connect hokr req complete karta hai
//on the other hand,normal backend ek baar db se connect hogaya tho vo continuously chalta rehta hai 
//IMP -> isme(nextjs) check karna hota hai ke db se already connect hai ki nahi agar nahi hai tho connect karna hai
//aur agar hai tho req nahi jaani chaiye bcs jab bhi humlok verify, signin ,signup req overload ho jaati hai, aur app choke 
//kar jaati hai 
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema)) 
export default UserModel;