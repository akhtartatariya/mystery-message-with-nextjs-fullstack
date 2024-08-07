import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcryptjs from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await User.findOne({ username, isVerified: true })
        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: "Username already taken", }, { status: 400 })
        }

        const existingUserByEmail = await User.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({ success: false, message: "User already exist with this email" }, { status: 400 })
            }
            else {
                existingUserByEmail.username = username
                const hashedPassword = await bcryptjs.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcryptjs.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        console.log(emailResponse)
        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 })
        }
        return Response.json({ success: true, message: "User registered successfully. Please verify your email" }, { status: 201 })
    } catch (error) {
        console.error(" Error registering user", error)
        return Response.json({ success: false, message: "Error registering user" }, { status: 500 })
    }
}

