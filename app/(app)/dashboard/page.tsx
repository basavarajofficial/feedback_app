"use client"

import { useToast } from '@/components/hooks/use-toast';
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message, User } from '@/model/User.model';
import { acceptMessagSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Check, CopyIcon, Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

function Dashboard() {
    const [messages, setMessages ] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [ isCopied, setIsCopied] = useState<boolean>(false);

    const { data: session} = useSession();

    const {toast} = useToast();

    const handleDeleteMessage = (messageId: string) => {
        let filteredMessages = messages.filter((message) => messageId !== message._id );
        setMessages(filteredMessages);
    }

    const form = useForm({
        resolver: zodResolver(acceptMessagSchema)
    });

    const { watch, register, setValue } = form;

    const acceptingMessages= watch('acceptMessages');

    const fetchAcceptMessages = useCallback(async () => {
        try {
            const response = await axios.get<ApiResponse>('/api/acceptMessages');
            setValue('acceptMessages', response.data.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }
    },[setValue]);

    //* fetch messages
    const fetchMessages = useCallback(async (refresh : boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/getMessages');

            setMessages(response.data.messages || []);
            if(refresh){
                toast({
                    title: 'Refreshed Messages',
                    description: "Showing latest messages",
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message,
                variant: "destructive"
            });
        }
        finally{
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        if (!session || !session.user) return;

        fetchAcceptMessages();
        fetchMessages();
    }, [ session, setValue, fetchAcceptMessages, fetchMessages ]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/acceptMessages', {
                acceptingMessages : !acceptingMessages
            })
            setValue('acceptMessages', !acceptingMessages)
            toast({
                title: response.data.message,
                variant: 'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }
    }


    if(!session || !session.user){
        return <div>Please login</div>
    }

    const {username} =  session.user as User;
    const baseURL = `${window.location.protocol}//${window.location.host}`
    const profileURL = `${baseURL}/u/${username}`

    const copyToClipBoard = async () => {

       try {
         await navigator.clipboard.writeText(profileURL);
        setIsCopied(true);
         toast({
             title: 'URL copied to clipboard',
             variant: "default"
         })
         setTimeout(() => {
            return setIsCopied(false)
         }, 2000);
       } catch (error) {
        toast({
            title: 'Failed to copy',
            variant: "destructive"
        })
        setIsCopied(false);
       }
    }


  return (
    <div className='w-full '>
        <div className='ml-12 mr-12 mt-8 '>
            <h1 className='text-balance font-mono text-3xl font-extrabold'>Dashboard</h1>
            <div className='w-full flex gap-2 pt-4 items-center pb-4'>
                <input className='w-2/4 p-2 pl-4 rounded-md bg-gray-900 font-light text-gray-400'
                type="text" value={profileURL} />
                <abbr title='copy to clipboard'>
                <Button>
                    {
                        isCopied ? <Check className='animate-bounce repeat-1' /> :
                        <CopyIcon className='font-thin w-5 h-5' onClick={copyToClipBoard}  />
                    }
                </Button>
                </abbr>
            </div>

            <div className="flex items-center space-x-2 mb-5">
                <Switch id="acceptMessages" className='bg-red-500 border-2 text-gray-400'
                {...register('acceptMessages')}
                    checked={acceptingMessages}
                    onCheckedChange={handleSwitchChange}  />
                <Label htmlFor="acceptMessages">Accept Messages</Label>
            </div>

            <Separator className='bg-gray-500' />

            <Button
                className="mt-4"
                variant="ghost"
                onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
                }}
            >
                {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <RefreshCcw className="h-4 w-4" />
                )}
            </Button>

            {/* Show all messages */}
            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
                {
                    messages.length > 0 ? (
                        messages.map((message, index) => (
                            <MessageCard
                                key={message._id}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) :
                        (
                            <p className='flex items-center justify-center font-mono text-lg md:text-xl font-bold'>No Messages Found</p>
                        )
                }
            </div>

        </div>
    </div>
  )
}

export default Dashboard
