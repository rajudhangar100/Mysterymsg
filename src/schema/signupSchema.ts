import { z } from "zod";

export const usernameValidation=z
.string()
.min(2,"username must be atleast 2 characters")
.max(20,"username cannot more than 20 characters")
// .regex(/^[a-zA-Z0-9]+$/,"special characters are not allowed in username")

export const signupVerification=z.object({
    username:usernameValidation,
    email:z.string().email({message:"enter a valid email"}),
    password:z.string().min(6,{message:"password must contain atleast 6 characters"})
})