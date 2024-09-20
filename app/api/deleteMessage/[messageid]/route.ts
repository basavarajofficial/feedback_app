import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { User } from "@/model/User.model";
import mongoose from "mongoose";


export async function DELETE(req: Request,
    { params }: { params: { messageid: string } }
    ){

    const messageId = params.messageid;
    await dbConnect();

    const session = await getServerSession(authOptions);

    const _user: User =  session?.user as User;

    if(!session || !_user){
        return Response.json({success: false, message: "Not Authenticated"}, { status: 401});
    }

    try {
        const UpdateMessages = await UserModel.updateOne({
            _id: _user._id
        }, { $pull : {messages : { _id : messageId }} });

        if(UpdateMessages.modifiedCount === 0){
            return Response.json({success: false, message: "Message not found or already deleted"}, { status: 404})
        }

        return Response.json({success: true, message: "Message deleted"}, {status: 200})

    } catch (error) {
        return Response.json({success: false, message: "Error Deleting Message"}, {status: 500})
    }

}
