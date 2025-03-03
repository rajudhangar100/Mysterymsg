'use client'
import { useDebounceCallback } from 'usehooks-ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupVerification } from "@/schema/signupSchema";
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import axios,{ AxiosError} from "axios";
import { Apiresponse } from "@/types/apiresponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [username,setusername]=useState("");
  const [usernameMsg,setusernameMsg]=useState("");
  const [ischeckusername,setischeckusername]=useState(false);
  const [issubmiting,setissubmiting]=useState(false);
  //we had to debounce callback by set method to update username by a delay and now use , username as changing value
  const debounced = useDebounceCallback(setusername, 500);
  const { toast } = useToast();
  const router= useRouter();

  //zod implementation: useform() -> custom hook to manage all form constraints by adding more schemas and default values
  const form=useForm<z.infer<typeof signupVerification>>({
    resolver:zodResolver(signupVerification),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })

  useEffect(()=>{
    const checkUniqueUsername=async ()=>{
      if(username){
        setischeckusername(true);
        setusernameMsg("");
        try{
          const result = await axios.get(`/api/check-unique-username?username=${username}`);
          setusernameMsg(result.data.message);
        }catch(error){
          const axiosError=error as AxiosError<Apiresponse>
          setusernameMsg(axiosError.response?.data.message ?? "Error checking Username");
        }finally{
          setischeckusername(false);
        }
      }
    }
    checkUniqueUsername();
  },[username]);

  const onSubmit=async (data: z.infer<typeof signupVerification>) =>{
    setissubmiting(true);
    try{
      const result = await axios.post('/api/sign-up',data);
      toast({
        title:'Success',
        description:result.data.message
      })
      setissubmiting(false);
      router.replace(`/verify/${data.username}`);
    }catch(error){
      console.error("Unexpected Error: ",error);
      const axiosError=error as AxiosError<Apiresponse>;
      const errorMsg=axiosError.response?.data.message;
      toast({
        title:'failure',
        description:errorMsg?.toString(),
        variant:'destructive'
      })
      setissubmiting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-1">
              Join Mystery Message
            </h1>
            <p className="mb-3 text-sm">
              Sign up to start your anonymous adventure
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" 
                {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              { ischeckusername && (<>
              <Loader2 className="animate-spin"/>
              </>)}
              {<p className={`${usernameMsg==="Username is unique" ? ('text-green-500') : ('text-red-500')} text-sm`}>{usernameMsg}</p>}
              <FormMessage />
            </FormItem>
          )}
        />

            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" 
                {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password"  
                {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
            <Button type="submit" disabled={issubmiting}>
              {
                issubmiting?(
                <>
                  <Loader2 className="mr-4 h-4 w-4 animate-spin"/>Please wait
                </>):("Sign up")
              }
            </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member? {' '}
              <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
                Sign-in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
