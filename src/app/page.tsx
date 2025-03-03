'use client'
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay";
import Link from "next/link";
import messages from "@/message.json";
import { useSession } from "next-auth/react";
import { Mail } from "lucide-react";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios";
 

const Home=()=>{
  const [date, setDate] = React.useState<Date>()
  const {data:session}=useSession();
  const handleclick = async ()=>{
    try{
      const data = await axios.get(`/api/checkconnectdb`);
    }catch(error){
      console.log("This is Error: ",error);
    }
  }
  return(<>
   <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
    <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
    </section>
    <Carousel plugins={[AutoPlay({delay: 4000})]} className="w-full max-w-xs"> 
      <CarouselContent >
        {messages.map((message,index)=>(
          <CarouselItem key={index} className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>{message.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
              <Mail className="flex-shrink-0" />
              <div>
                <p>{message.content}</p>
                <p className="text-xs text-muted-foreground">
                  {message.received}
                </p>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    <section className="my-1 flex flex-col gap-2">
      <h1 className="text-xl text-center">Kindly let us know your joining date</h1>
      <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[100%] justify-start text-left font-normal text-black ",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    {session && <Button className="w-[100%] mt-10 hover:bg-slate-700 "><Link href="/dashboard">Go to Dashboard</Link></Button> } 
    </section>
    </main>
    <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.<br></br>
      </footer>
  </>)
}
export default Home