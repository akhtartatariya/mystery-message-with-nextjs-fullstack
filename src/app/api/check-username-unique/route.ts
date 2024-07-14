import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import User from "@/models/user.model";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("this is result:",result)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({ success: false, message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters" }, { status: 400 })
        }

        const { username } = result.data

        const existingUser = await User.findOne({ username, isVerified: true })
        if (existingUser) {
            return Response.json({ success: false, message: "username already taken" }, { status: 400 })
        }
        return Response.json({ success: true, message: "username is unique" }, { status: 200 })
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({ success: false, message: "Error checking username" }, { status: 500 })
    }
}