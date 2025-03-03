'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schema/verifySchema';
import { Apiresponse } from '@/types/apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const Page = () => {
    const router=useRouter();
    const params = useParams<{username:string}>();
    const {toast}=useToast()
    const form=useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
      })

    const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
        try{
            console.log("request se gaya hua code: ",data.code);
            const result=await axios.post('/api/verify-code',{username:params.username,code:data.code})
            console.log(result);
            toast({
                title:'Success',
                description:result.data.message
            })
            router.replace('/sign-in');
        }catch(error){
            console.error("Unexpected Error: ",error);
            const axiosError=error as AxiosError<Apiresponse>;
            const errorMsg=axiosError.response?.data.message;
            toast({
              title:'failure',
              description:errorMsg?.toString(),
              variant:'destructive'
            })
        }
    }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className='text-2xl font-extrabold tracking-tight lg:text-3xl mb-1'>Verify your Account</h1>
                <p className="mb-3 text-sm">
                    Enter the verification code sent to your email
                </p>
            </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  </div>
</>
  )
}

export default Page
