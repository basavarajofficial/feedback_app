import mongoose, { Schema , Document, Model} from "mongoose";


export interface Message extends Document{
    content : string;
    createdAt : Date;
}

export interface User extends Document{
    username : string;
    email : string;
    password: string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessage : boolean;
    messages: Message[]
}


const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        required: true,
        default: Date.now()
    }
});


const UserSchema: Schema<User> = new Schema({
    username : {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        match: [/a-zA-Z._%+-].+\@.+\..+/, 'Please enter a valid email address']
    },
    password : {
        type: String,
        required: [true, "Password is required!!"],
    },
    verifyCode : {
        type: String,
        required: [true, "Verify code is required!!"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry : {
        type: Date,
        required: [true, "Verify code expiry is required!!"],
    },
    isAcceptingMessage : {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema],

})


// const userModel : Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);
const UserModel  = mongoose.models.User as Model<User> || mongoose.model<User>('User', UserSchema);

export default UserModel;
