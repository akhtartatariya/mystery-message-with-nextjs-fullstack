import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { User as userTypes } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user as userTypes

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }

    const userId = user._id

    const { isAcceptingMessage } = await request.json()
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            isAcceptingMessage
        }, { new: true })

        if (!updatedUser) {

            return Response.json({ success: false, message: "Error while update toggle messages status" }, { status: 401 })
        }

        return Response.json({ success: true, message: " message acceptance status updated successfully", updatedUser }, { status: 200 })
    } catch (error) {
        console.error("Error while toggle messages status", error)

        return Response.json({ success: false, message: "Error while toggle messages status" }, { status: 500 })

    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user as userTypes

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }

    const userId = user._id

    try {
        const user = await User.findById(userId)
        if (!user) {

            return Response.json({ success: false, message: "User not Found" }, { status: 401 })
        }

        return Response.json({ success: true, isAcceptingMessages: user.isAcceptingMessage }, { status: 200 })
    } catch (error) {
        console.error("Error while getting messages status", error)
        return Response.json({ success: false, message: "Error while getting messages status" }, { status: 500 })
    }
}