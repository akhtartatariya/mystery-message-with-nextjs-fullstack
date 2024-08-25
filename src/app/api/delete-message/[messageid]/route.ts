import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { User as userTypes } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user as userTypes

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }
    try {
        const updatedUser = await User.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageId } } })
        if(updatedUser.modifiedCount===0){
            return Response.json({ success: false, message: "message not found or already deleted" }, { status: 404 })
        }

        return Response.json({ success: true, message: "message deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error while deleting message", error)
        return Response.json({ success: false, message: "Error while deleting message" }, { status: 500 })
    }

}