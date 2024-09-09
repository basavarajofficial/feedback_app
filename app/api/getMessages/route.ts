import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(req: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User =  session?.user as User;

    if(!session || !session.user){
        return Response.json({success: false, message: "Not Authenticated"}, { status: 401});
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const userWithMessages = await UserModel.aggregate([
            { $match : {id: userId }},
            { $unwind : '$messages'},
            { $sort : {'messages.createdAt': -1 }},
            { $group : {_id: '$_id', messages : { $push : '$messages'}}}
        ]);
        if(!userWithMessages || userWithMessages.length === 0){
        return Response.json({success: false, message: "User do not have any messages, Not found!"}, { status: 500});
    }
    return Response.json({success: true, message: userWithMessages[0].messages }, { status:200})
    } catch (error) {
        console.log("Failed to update user to accept message", error);
        return Response.json({success: false, message: "Failed to update user to accept message"}, { status: 500});
    }
}
