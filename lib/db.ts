import mongoose from "mongoose";

const connectionString = process.env.MONGODB_URI;

type connectionObject = {
    isConnected? : number;
};

const connection : connectionObject = {}

 const dbConnect = async () :  Promise<void>  => {
    if(connection.isConnected){
        console.log("Already connected to MongoDB");
        return
    }
    try {
        const db = await mongoose.connect(connectionString || "", {});
        connection.isConnected =  db.connections[0].readyState;

        console.log("DB connected successfully");

    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);

    }
}

export default dbConnect;
