import dbConnect from "@/lib/db";
import UserModel, { Message } from "@/model/User.model";


export async function POST(req : Request){
    await dbConnect();

    const { username, content } = await req.json();

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({success: false, message: "User not found"}, { status: 404});
        }else if(!user.isAcceptingMessages){
            return Response.json({success: false, message: "User not accepting messages"}, { status: 403});
        }

        const newMessage = { content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({success: true, message: "Message sent succefully"}, { status: 200});

    } catch (error) {
        console.log("Error while sending message", error);
        return Response.json({success: false, message: "Error while sending message"}, { status: 500});
    }
}
