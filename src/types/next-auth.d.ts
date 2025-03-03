import "next-auth"
import { DefaultSession } from "next-auth"
import { Message } from "postcss"

declare module 'next-auth'{
    interface User{
        id:String,
        email:String,
        username?:String,
        password?:String,
        isVerified?:Boolean,
        isAcceptingMsg?:Boolean,
        messages?:Array<Message>
    }
    interface Session{
        user:{
            id?:String,
            email?:String,
            username?:String,
            password?:String,
            isVerified?:Boolean,
            isAcceptingMsg?:Boolean,
            messages?:Array<Message>
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        id:String,
        email:String,
        username?:String,
        password?:String,
        isVerified?:Boolean,
        isAcceptingMsg?:Boolean,
        messages?:Array<Message>
    }
}