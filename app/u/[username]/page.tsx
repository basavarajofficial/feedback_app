"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { messageSchema } from '@/schemas/messageSchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from "@/components/hooks/use-toast";

const PublickProfile = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const params = useParams();
    const { username } = params;

    const { toast } = useToast();


     // 1. Define your form.
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
        content: ""
        },
    });

    async function submitHandler(data: z.infer<typeof messageSchema>){
        setIsLoading(true);

        try {
            const res = await axios.post<ApiResponse>('/api/sendMessages',{ ...data, username });
            if(res.status === 200){
                setIsLoading(false)
                toast({
                    title:"Success",
                    description: res.data.message,
                    variant: "default"
                });
            }

        } catch (error) {
            setIsLoading(false);
            const axiosError = error as AxiosError<ApiResponse>;
            // Default error message
            let errorMessage = axiosError.response?.data.message;

            toast({
                title: 'Failed to send message',
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

  return (
    <div className='w-full min-h-screen bg-black text-gray-300'>
        <div className="mx-10 md:mx-32 flex flex-col gap-10">
        <h1 className='text-xl md:text-2xl lg:text-3xl mt-10 text-center font-bold'>Public Profile Link</h1>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} >
        <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Send Anonymous message to @{username}</FormLabel>
                <FormControl>
                    <Textarea rows={3} placeholder="Enter your message here..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={isLoading} className='mt-5 mx-auto flex justify-center border'>
                {isLoading ?
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                </>
                : "Send It"}
            </Button>
        </form>
        </Form>
        </div>
    </div>
  )
}

export default PublickProfile
