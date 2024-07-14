import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { Message } from "@/models/user.model";



export async function POST(request: Request) {
    await dbConnect()
    const { username, content } = await request.json();
    try {

        const user = await User.findOne({ username })
        if (!user) {

            return Response.json({ success: false, message: "User not Found" }, { status: 404 })
        }

        if (!user.isAcceptingMessage) {
            return Response.json({ success: false, message: "User is not accepting messages" }, { status: 404 })
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({ success: true, message: "Message sent successfully" }, { status: 201 })
    } catch (error) {
        console.error(" Error while sending messages", error)

        return Response.json({ success: false, message: "Error while sending messages" }, { status: 500 })
    }
}