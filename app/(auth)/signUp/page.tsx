"use client"

import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import axios, { AxiosError } from 'axios'

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
import { useEffect, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { Loader2 } from 'lucide-react'
import { useDebounceCallback } from "usehooks-ts";


const SignUp = () => {

    const [username, setUsername] = useState<string>("");
    //* Debounce to update username
    const debounced = useDebounceCallback(setUsername, 500);

    // const [debouncedUsername, setDebouncedUsername] = useState<string>(username);
    const [usernameMessage, setUsernameMessage] = useState<string>("");
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { toast } = useToast();
    const router = useRouter();


    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    //* my Debounce technique
    useEffect(() => {
        async function checkUsername(){
            if(username){
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);
                    let message = response.data.message;
                    setUsernameMessage(message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    let axiosErrorMessage = axiosError.response?.data.message;
                    setUsernameMessage( axiosErrorMessage ?? 'Error checking username');
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsername()
    }, [username]);

     // Debounce logic
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedUsername(username); // Update debouncedUsername only after delay
//     }, 600); // Delay of 0.6 second

//     // Cleanup function to clear timeout if the user is still typing
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [username]); // Re-run effect if username changes

  // API call when debouncedUsername changes
//   useEffect(() => {
//     const checkUsername = async () => {
//       if (!debouncedUsername.trim()) {
//         setUsernameMessage('');
//         setIsCheckingUsername(false);
//         return;
//       }

//       setIsCheckingUsername(true);
//       try {
//         const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${debouncedUsername}`);
//         let message = response.data.message;
//         setUsernameMessage(message);
//       } catch (error) {
//         const axiosError = error as AxiosError<ApiResponse>;
//         setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
//       } finally {
//         setIsCheckingUsername(false);
//       }
//     };

//     checkUsername();
//   }, [debouncedUsername]); // Only call API when debouncedUsername changes

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        setIsSubmitting(true);
        try {
            const res = await axios.post<ApiResponse>('/api/signUp', data);

            toast({
                title:"Success",
                description: res.data.message,
                variant: "default"
            });

            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error('Error during sign-up:', error);

            const axiosError = error as AxiosError<ApiResponse>;

            // Default error message
            let errorMessage = axiosError.response?.data.message;

            toast({
                title: 'Sign Up Failed',
                description: errorMessage,
                variant: "destructive",
            });

            setIsSubmitting(false);
        }
    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl >
                <Input required placeholder="username" {...field}
                    onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                    }}
                />
                </FormControl >
                {isCheckingUsername && <Loader2 textAnchor="Please wait" className="animate-spin" />}
                {!isCheckingUsername && usernameMessage && (
                    <p className={`text-sm ${
                        usernameMessage === 'username is available'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                    >
                    {usernameMessage}
                    </p>
                )}

            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem >
                <FormLabel>Email</FormLabel>
                <FormControl>
                <Input  placeholder="abc@example.com" {...field} required />
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
            : "Signup"}
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/signIn" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
    </div>
    </div>
  )
}

export default SignUp;
