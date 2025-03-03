'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { signinSchema } from '@/schema/signinSchema';
import { Apiresponse } from '@/types/apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ButtonGoogle from '@/components/Button';


const Page = () => {
  const [ issubmiting,setissubmiting ] =useState(false);
  const router=useRouter();//used to redirect to another page
  const {toast}=useToast();//used to send notification
  //used to verify data, given in the form , here username and password;
  const form = useForm({
    resolver : zodResolver(signinSchema),
    defaultValues : {
      email:"",
      password:""
    }
  })

  //useEffect for effectively checking each letter of the username entered by user, and
  //using debounce to delay the verification by some ms
  

  //handles submit , here data must be of signinSchema
  const onSubmit = async (data:z.infer<typeof signinSchema>) =>{
    setissubmiting(true);
    console.log("data of form: ",data);
    const result = await signIn("credentials",{ 
      email:data.email,
      password:data.password,
      redirect:false
    })
    console.log("result after authorizing with next auth: ",result);
    if(result?.ok==false){
      console.log("error block")
      toast({
        title:"Login failed",
        description:"Incorrect Email or password",
        variant:"destructive"
      });
    }else{
      router.replace("/dashboard");
    }
    setissubmiting(false);
    // try{
    //   const result = await axios.post('/api/sign-in',data);
    //   toast({
    //     title:"Success",
    //     description:result.data.message
    //   })
    //   setissubmiting(false);
    //   router.replace('/dashboard');
    // }catch(error){
    //   console.error("Unexpected signin error: ",error);
    //   const axiosError = error as AxiosError<Apiresponse>;//this sends the error in the form of axios error and it is of object dataype
    //   toast({
    //     title:"Error Sigin the user",
    //     description:axiosError.response?.data.message || "unexpectod error from catch",
    //     variant:'destructive'
    //   })
  }
  
  return (
    <>
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className='text-center'>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-1">
              Join Mystery Message
        </h1>
        <p className="mb-3 text-sm">
            Sign in to start your anonymous adventure
        </p>
       </div>
       <Form { ...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                <Input placeholder="password" type='password'
                {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={issubmiting}> 
          {issubmiting ? (<><Loader2 className='animate-spin'></Loader2>Please wait</>): "Sign In"}
        </Button>
        </form>
       </Form>
       <div className='text-center pt-4'>
        <p>New to this Site? {" "}
          <Link href='/sign-up' className='text-blue-500 hover:text-blue-800 cursor-pointer'>Sign up</Link>
        </p>
       </div>
       <div className='my-3'>
        <ButtonGoogle/>
       </div>
      </div>
     </div> 
    </>
  )
}

export default Page
