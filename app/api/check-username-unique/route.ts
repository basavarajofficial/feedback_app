import dbConnect from "@/lib/db";
import UserModel from "@/model/User.model";
import { usernameValidationSchema } from "@/schemas/signUpSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
    username: usernameValidationSchema
});

export async function GET(req: Request){
    await dbConnect();

    try {
        const { searchParams } =  new URL(req.url);

        const queryParams = {
            username: searchParams.get("username")
        }
        //* validate with Zod
        const validate = usernameQuerySchema.safeParse(queryParams);

        if(!(validate.success)){
            const usernameErrors = validate.error.format().username?._errors || [];
            return Response.json({success: false, message: usernameErrors?.length > 0
                ? usernameErrors.join(', ')
                : 'Invalid query parameters'
            }, {status: 400});
        }

        const {username} = validate?.data;
        const existingVeriedUser = await UserModel.findOne({username, isVerified: true});
        if(existingVeriedUser){
            return Response.json({success: false, message: "username is occupied"},{status: 200});
        }
        return Response.json({success: true, message: "username is available"},{status: 200});

    } catch (error) {
        console.error("Error checking unique username", error);
        return Response.json({success: false, message: "Error checking unique username"},{status: 500});
    }
}
