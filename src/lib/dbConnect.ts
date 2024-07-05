import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already db is connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "",)

        connection.isConnected = db.connections[0].readyState
        console.log("db connected successfully")
        // console.log("db connections",db.Connection)
    } catch (error) {
        console.log("Error connecting to MongoDB", error)
        process.exit(1)
    }
}

export default dbConnect