// pages/api/generateStory.js

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {

    // Access your API key as an environment variable
    const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY || "");
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    try {
        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const convertText=text.split('||')
        return Response.json({ success: true, data: convertText ,message:"generate message successfully"},{status:201})

    } catch (error) {
        console.error("Error generating story:", error);
        return Response.json({ success: false, message: "Error while generate the message" }, { status: 500 })
    }
}
