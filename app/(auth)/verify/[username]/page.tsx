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


function VerifyCode() {

    const params = useParams();
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
        const res = await axios.post<ApiResponse>('/api/verifyCode', {...data, username: params.username});
        console.log(res);
        toast({
            title: "Success",
            description: res.data.message
        })
        setIsSubmitting(false);
        router.replace('/dashboard');
    } catch (error) {
        console.log(error);
        setIsSubmitting(false);
        const axiosError = error as AxiosError<ApiResponse>;

        // Default error message
        let errorMessage = axiosError.response?.data.message;

        toast({
            title: 'Verification Failed',
            description: errorMessage,
            variant: "destructive",
        });
    }
  }

  return (
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
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ?
            <p className="animate-pulse">
                <p>verifying...</p>
            </p>
            : "Verify"}
        </Button>
      </form>
    </Form>
  )
}

export default VerifyCode;
