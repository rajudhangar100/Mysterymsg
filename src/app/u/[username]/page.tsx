'use client'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast, useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Message, MessageState } from "@/models/User"
import axios, { Axios, AxiosError } from "axios"
import { Apiresponse } from "@/types/apiresponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { messagesSchema } from "@/schema/messagesSchema"

const Page = ({params}:any) => {
  const username=params.username;
  const [isloading,setisloading]=useState(false);
  const [msg,setMsg]=useState<MessageState>({content:" ",createdAt: new Date()});
  const { toast } = useToast();
  
  //useForm
  const form=useForm<z.infer<typeof messagesSchema>>({
    resolver : zodResolver(messagesSchema)
  })
  //SendMessages 
  const sendmsg=async(data:z.infer<typeof messagesSchema>)=>{
    setisloading(true);
    const content=data.content
    try {
      const result = await axios.post('/api/send-message',{username,content});
      toast({
        title:"Success",
        description:result.data.message  || "Messages sent  successfully from this account"
      })
    } catch (error) {
      console.log("Error from sending msgs to db: ",error);
      const axiosError = error as AxiosError<Apiresponse>
      toast({
        title:"Error from catch",
        description: axiosError.response?.data.message || "Messages did not sent successfully"
      })
    }finally{
      setisloading(false);
    }
  }

  return (
    <>
      <div className='flex my-5  flex-col gap-4 items-center mx-20'>
        <h1 className='text-3xl font-semibold'>Public Profile Link</h1>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(sendmsg)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="content" //jo humare schema mai keys hai vo values yaha par aayenge
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Anonymous messages to @{params.username}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message here"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </>
  )
}

export default Page
