"use client"


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Message } from "@/model/User.model";
import { useToast } from "./hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from 'dayjs';
import { X } from "lucide-react";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
    const { toast } = useToast();

    const deleteHandler = async () => {
        try {
          const response = await axios.delete<ApiResponse>(
            `/api/deleteMessage/${message._id}`
          );
          console.log(response);

          toast({
            title: response.data.message,
          });
          onMessageDelete(message._id);

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: 'Error',
            description:
              axiosError.response?.data.message ?? 'Failed to delete message',
            variant: 'destructive',
          });
        }
      };

  return (
    <Card className=" border-none bg-gray-900 text-gray-300">
      <CardHeader>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-3">
        <CardTitle>{message.content}</CardTitle>
         <p className="text-sm text-gray-400">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"  className="rounded-full w-10 h-10 p-2">
                <X className="w-10 h-10" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message and from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 text-white" onClick={deleteHandler}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
