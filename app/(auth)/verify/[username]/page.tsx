"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { verifySchema } from "@/schemas/verifySchema"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"


function VerifyCode() {

    const params = useParams<{username: string}>();
    const router = useRouter();

    const[ isSubmitting, setIsSubmitting ] = useState<boolean>(false);


  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof verifySchema>) {

    setIsSubmitting(true);
    try {
        const res = await axios.post<ApiResponse>('/api/verifyCode', {code: data.code, username: params.username});

        toast({
            title: "Success",
            description: res.data.message
        })
        setIsSubmitting(false);
        router.replace('/signIn');
    } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<ApiResponse>;

        // Default error message
        let errorMessage = axiosError.response?.data.message;

        toast({
            title: 'Verification Failed',
            description: errorMessage,
            variant: "destructive",
        });
        setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className=" flex flex-col items-center justify-center max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-extrabold mb-6">Verify your account</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ?
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                verifying...
            </>
            : "verify"}
        </Button>
      </form>
    </Form>
    </div>
    </div>
  )
}

export default VerifyCode;
