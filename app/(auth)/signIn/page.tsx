"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { Loader2 } from 'lucide-react'
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { useState } from "react";


const Signinn = () => {


    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { toast } = useToast();
    const router = useRouter();


    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        }
    });

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        setIsSubmitting(true);
        const res = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        console.log(res);

        if(res?.error){
            setIsSubmitting(false);
            toast({
                title: "Error Signing In",
                description: res.error,
                variant: "destructive"
            })
        }else{
            setIsSubmitting(false);
            toast({
                title: "Success",
                description: "Congratulations! You signed in successfully",
            })
        }

        if(res?.url){
            router.replace('/dashboard');
        }


    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign-in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
            <FormItem >
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                <Input  placeholder="email/username" {...field} required />
                </FormControl >
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ?
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
            </>
            : "Sign In"}
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
          Don&apos;t have an account?
            <Link href="/signUp" className="text-blue-600 hover:text-blue-800 ml-2">
              Sign Up
            </Link>
          </p>
        </div>
    </div>
    </div>
  )
}

export default Signinn;
