'use client'

import Messagecard from "@/components/Messagecard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message, MessageState } from "@/models/User";
import { acceptMsgSchema } from "@/schema/acceptMsgSchema";
import { Apiresponse } from "@/types/apiresponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Router } from "lucide-react";
import { useSession } from "next-auth/react";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//If we've used react-hook form in any part of our application, then we have to maintain consistency 
//across the entire application so either using state or react-hook form even for very small buttons
//such as switch button which is a very basic element of form


const Page = () => {
  const [messages,setmessages]=useState<Message[]>([]);
  const [isloading,setisloading]=useState(false);
  const [isswitchloading,setisswitchloading]=useState(false);
  const router = useRouter();
  const [profileURL,setprofileURL] = useState("");


  const {toast}=useToast();
  //optimistic UI
  const handledeletemessage=(messageID:string)=>{
    setmessages(messages.filter((message)=> message._id !== messageID))
  }

  const { data:session }=useSession();
  const user = session?.user;
  const username=user?.username;

  //form handling, here in this page, toggle/switch button
  const form=useForm({
    resolver:zodResolver(acceptMsgSchema)
  })
  //taking out methods from form object
  const { register,watch,setValue }=form;
  const acceptMessages=watch('acceptmessage');

  //Now, checking that is User accepting the message using useCallback
  const fetchisAcceptMsg=useCallback(async ()=>{
    setisswitchloading(true);
    try{
      const result=await axios.get('/api/acceptmsg');
      // console.log("Response from built-in api from isAcceptMsg: ",result);
      setValue('acceptmessage',result.data.isAcceptingMsg);//Assigning the value
    }catch(error){
      // console.error("Error checking the status of user accepting message ",error);
      const axiosError=error as AxiosError<Apiresponse>;//apiresponse ke form mai return hoga 
      console.log("Axios Error ",axiosError);
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Error from catch",
        variant:'destructive'
      })
    }finally{
      setisswitchloading(false);
    }
  },[setValue])

  const fetchMessage=useCallback(async (refresh:Boolean=false)=>{
    setisloading(true);
    try{
      const response = await axios.get<Apiresponse>('/api/get-message');
      setmessages(response.data.messages || [])
      if(refresh){
        toast({
          title:"Success",
          description:"Messages collected successfully"
        })
      }
    }catch(error){
      console.log("Error getting the user messages ",error);
      const axiosError=error as AxiosError<Apiresponse>;//apiresponse ke form mai return hoga 
      console.log("Axios Error ",axiosError);
      toast({
        title:"Refreshed",
        description:axiosError.response?.data.message || "Error from catch",
      })
    }finally{
      setisloading(false);
    }
  },[setisloading,setmessages])

  const changeMsgStatus=async ()=>{
    setisswitchloading(true);
    try {
      const response = await axios.post<Apiresponse>('api/acceptmsg',{isAcceptingMsg:!acceptMessages});//post req mai data yahi se bhejna hai, then api mai vo process hoga
      setValue('acceptmessage',!acceptMessages);
      toast({
        title:response.data.message,
        variant:'default'
      })
    }catch(error){
      console.error("Error changing the status of the user messages ",error);
      const axiosError=error as AxiosError<Apiresponse>;//apiresponse ke form mai return hoga 
      console.log("Axios Error ",axiosError);
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Error from catch",
        variant:'destructive'
      })
    }finally{
      setisswitchloading(false);
    }
  }

  useEffect(()=>{
    if(!session || !user) return;
    fetchMessage();
    fetchisAcceptMsg();
  },[session,setValue])

  //Do more research
  useEffect(()=>{
    setprofileURL(`${window.location.protocol}//${window.location.host}/u/${username}`);
  },[]);

  //when button is clicked then this function will be triggered
  const copytoclipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title:"URL copied",
      description:"Profile URL successfully copied"
    })
  }

  if(!session || !user){
    router.replace("/sign-in");
  }
  return (
    <>
     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2  className="text-lg font-semibold mb-2">Copy your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
          type="text"
          value={profileURL}
          disabled
          className="input input-bordered w-full p-2 mr-2"/>
          <Button onClick={copytoclipboard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch 
        {...register('acceptmessage')}
        checked={acceptMessages}
        onCheckedChange={changeMsgStatus}
        disabled={isswitchloading}
        />
        <span className="ml-2">
          Accept Messages:{acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator/>
      <Button className="mt-4" variant="outline" onClick={(e)=>{e.preventDefault();fetchMessage(true)}}>
        {isloading ? <Loader2 className="h-4 w-4 animate-spin"/> : <RefreshCcw className="h-4 w-4"/>}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        { messages.length > 0 ? (
          messages.map((message,index)=>(
            <Messagecard 
              key={message.id} 
              message={message}
              onMessageDelete={handledeletemessage}
            />
          ))
        ) : (<p>No Messages to display</p>
        )}
      </div>
      </div> 
    </>
  )
}

export default Page
