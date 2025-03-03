'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import { Message } from "@/models/User"
import { useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { Apiresponse } from "@/types/apiresponse"
  
type Messagecardprops={
    message:Message;
    onMessageDelete:(messageId: any)=>void
}


const Messagecard = ({message,onMessageDelete}:Messagecardprops) => {
    const { toast }=useToast();
    const date=message.createdAt;
    const handleDeleteMessage=async ()=>{
        try{
          const result=await axios.delete<Apiresponse>(`/api/delete-message/${message._id}`);
        toast({
            title:result.data.message
        })
        onMessageDelete(message._id);
        }catch(error){
          console.log("Error Deleting the Message: ",error);
          const axiosError=error as AxiosError<Apiresponse>
          toast({
            title:"Error",
            description:axiosError.response?.data.message || "Error from Catch"
          })
        }
    }

  return (
    <Card >
    <CardHeader className="flex flex-row justify-between items-center">
      <CardTitle  >{message.content}</CardTitle>
      <div >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" ><X></X></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
    </AlertDialog>
    </div>
    </CardHeader>
    </Card>

  )
}

export default Messagecard
