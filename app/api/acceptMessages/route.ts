import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import { User } from "next-auth";


export async function POST(req: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User =  session?.user as User;

    if(!session || !session.user){
        return Response.json({success: false, message: "Not Authenticated"}, { status: 401});
    }

    const userId = user._id;
    const { acceptingMessages } = await req.json();
    console.log(userId, acceptingMessages);

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessages: acceptingMessages},
            { new : true}
        )

        if(!updatedUser){
            return Response.json({success: false, message: "Failed to update user status to accept messages"}, { status: 401})
        }

        return Response.json({success: true, message: "Message acceptace status updated successfully", updatedUser}, { status: 200});

    } catch (error) {
        console.log("Failed to update user to accept message", error);
        return Response.json({success: false, message: "Failed to update user to accept message"}, { status: 500});
    }
}


export async function GET(req: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User =  session?.user as User;

    if(!session || !session.user){
        return Response.json({success: false, message: "Not Authenticated"}, { status: 401});
    }

    const userId = user._id;

    try {
        const userFound = await UserModel.findById(userId);

        if(!userFound){
            return Response.json({success: false, message: "User not found"}, { status: 404})
        }

        return Response.json({success: true, isAcceotingMessages: user.isAcceptingMessages}, { status: 200});

    } catch (error) {
        console.log("Error in getting accept messages status", error);
        return Response.json({success: false, message: "Error in getting accept messages status"}, { status: 500});
    }
}
