import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/db";
import UserModel from "@/model/User.model";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, email, password} =  await request.json();

        const existingVerifiedUsername =  await UserModel.findOne({
            username,
            isVerified: true
        });
        if(existingVerifiedUsername){
            return Response.json({success: false, message: "username already taken!"}, {status: 500});
        }

        const existingUserByEmail = await UserModel.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({success: false, message: "User already exist with this email"}, {status: 400});
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const verifyCodeExpiryDate = new Date(Date.now() + 3600000); // 1 hour from now

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = verifyCodeExpiryDate;

                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiryDate = new Date(Date.now() + 3600000); // 1 hour from now

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode : verifyCode,
                verifyCodeExpiry : verifyCodeExpiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages: []
            })
            await newUser.save();
        }
        //* send Verification email
        const emailResponse = await sendVerificationEmail(email,username, verifyCode);
        console.log(emailResponse);

        if(!emailResponse.success){
            return Response.json({success: false, message: emailResponse.message }, { status: 500});
        }

        return Response.json({success: true, message: "User registered successfully. Please verify your email"}, { status: 201});


    } catch (error) {
        console.log("Error registering user", error);
        return Response.json({success: false, message: "Error registering user"}, { status: 500});
    }
}
