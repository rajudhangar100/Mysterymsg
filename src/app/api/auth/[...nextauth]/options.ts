import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import connectDb from "@/lib/connectDb";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import GoogleProvider from 'next-auth/providers/google'
import { Button } from "@react-email/components";

export const Authoptions: NextAuthOptions={
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || ''
          }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            id:"credentials",
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await connectDb();
                try{
                    const user=await UserModel.findOne({email:credentials.email});
                    if(!user){
                        throw new Error("Email is incorrect");
                    }
                    if(!user.isVerified){
                        throw new Error("Accuont is not Verified yet, verify the account the signing up");
                    }
                    const VerifyPassword=bcrypt.compare(credentials.password,user.password)
                    if(!VerifyPassword){
                        throw new Error("Password is incorrect");
                    }else{
                        return user;
                    }
                }catch(error){
                    console.log("Providers wale page se error aaya hai ",error);
                    throw new Error();
                }
            }
        })
    ],
    pages:{
        signIn:'sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXT_AUTH_SECRET,
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user.id=token.id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMsg=token.isAcceptingMsg;
                session.user.username=token.username;
            }
            return session
        },
        async jwt({ token, user,account }) {
            let hashedPassword
            await connectDb();
            if(user){
                token.id=user.id.toString()
                token.email=user.email.toString()
                token.password=user.password
                if(account?.provider == 'google'){
                    token.username=user.email.split('@')[0]
                }else{
                    token.username=user.username
                }
                try{
                    if(account?.provider === 'google'){
                        const password = user.password;
                        if(!password?.length){
                            hashedPassword='password'
                        }else{
                            hashedPassword=await bcrypt.hash(password as string,12);
                        }
                        const VerifyCodeExpiry=new Date();
                        const consumer = await UserModel.findOne({email:token.email});
                        if(!consumer){
                            await UserModel.create({
                                username:token.username,
                                email:token.email,
                                password: hashedPassword,
                                VerifyCode:'548392',
                                VerifyCodeExpiry,
                                isVerified:true,
                                isAcceptingMsg:true,
                                messages:[]
                            })
                        }
                    }
                }catch(error){
                    console.error("Error from callback signIn(): ",error);
                    throw new Error("Error from catch of adding user into db")
                }
            }
            return token
        }
    }
}