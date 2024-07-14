import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { verifySchema } from "@/schemas/verifySchema";



export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        console.log("Normal" + username)
        const decodedUsername = decodeURIComponent(username)
        console.log("decode username", username)
        const result = verifySchema.safeParse({code})
        if (!result.success) {
            const codeErrors = result.error.format().code?._errors || []
            return Response.json({ success: false, message: codeErrors.length > 0 ? codeErrors.join(", ") : "Invalid verification code" }, { status: 400 })
        }
        const user = await User.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({ success: false, message: "User not Found" }, { status: 500 })
        }
        const isValidCode = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isValidCode && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({ success: true, message: "User Verified Successfully" }, { status: 200 })
        }
        else if (!isCodeNotExpired) {
            return Response.json({ success: false, message: "Verification Code Expired" }, { status: 400 })
        }
        else {
            return Response.json({ success: false, message: "Invalid Verification Code" }, { status: 400 })
        }
    } catch (error) {
        console.error("Error Verifying User", error)
        return Response.json({ success: false, message: "Error Verifying User" }, { status: 500 })
    }
}