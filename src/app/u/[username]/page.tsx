'use client'
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from '@radix-ui/react-separator'
import Link from 'next/link'
import axios, { AxiosError } from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react'
import { messageSchema } from '@/schemas/messageSchema'
import { useParams } from 'next/navigation'
export default function page() {
  const [messages, setMessages] = React.useState([])
  const [content, setContent] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [loadingMsg, setLoadingMsg] = React.useState(false)
  const [messageText, setMessageText] = React.useState("")
  const { username } = useParams<{username:string}>()
  const { toast } = useToast()
  const generateMessages = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/suggest-messages')
      setMessages(response.data.data)
      toast({ title: "Suggested Messages are ready.", description: "Click on any message below to select it." });

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({ title: 'Error', description: axiosError.response?.data.message || "Failed to generate messages", variant: 'destructive' });
    }
    finally {
      setLoading(false)
    }
  }

  const sendMessages = async () => {
    setLoadingMsg(true)
    setContent("")
    setMessageText("")
    try {
      const result = messageSchema.safeParse({content})
      if(!result.success){
        const contentErrors = result.error?.format().content?._errors || []
        const errorMsg=contentErrors.length > 0 ? contentErrors.join(", ") : "Invalid query parameters"
        setMessageText(errorMsg)
        return
      }
      const response = await axios.post<ApiResponse>('/api/send-messages',{username,content})

      toast({ title: response.data.message });

    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      toast({ title: 'Error', description: axiosError.response?.data.message || "Failed to send messages", variant: 'destructive' });
    }
    finally{
      setLoadingMsg(false)
    }
  }
  useEffect(()=>{
    generateMessages()
  },[])
  return (
    <div className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center'>
      <h1 className='text-4xl font-bold text-center '>Public Profile Link</h1>
      <p className=' text-left mt-4 font-medium text-sm'>Send Anonymous Message to {"@name"}</p>
      <div className="grid w-full gap-2 mt-2 ">
        <Textarea placeholder="Type your message here." className=' resize-none' value={content} onChange={(e) => setContent(e.target.value)}/>
          {messageText && <p className='text-red-500'>{messageText}</p>}
        <Button className='w-40 mx-auto' onClick={sendMessages} disabled={loadingMsg}>Send message</Button>
      </div>
      <Button className='mt-20 w-40' onClick={generateMessages} disabled={loading}>{loading ?(loading && <Loader2 className='animate-spin mx-auto' />):"Suggest Messages"}</Button>
      <p className='mt-4 text-base'>Click on any message below to select it.</p>
      <div className=' border border-gray-200 p-4 rounded-xl mt-4' >
        <h3 className='text-xl font-semibold '>Messages</h3>
        {messages?.map((message,index)=>(
          <p key={index} className='text-center mt-2 text-sm cursor-pointer hover:underline border border-gray-200 p-2 rounded-lg' onClick={()=>setContent(message)}>{message}</p>
        ))}
      </div>
      <Separator />
      <p className='text-center mt-4 text-base'>Get Your Message Board</p>
      <Link href='/sign-up' className='text-center'><Button className='w-40 px-4 py-2 mt-4 '>Create Your Account</Button></Link>

    </div>
  )
}
