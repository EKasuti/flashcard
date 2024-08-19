import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a flashcard creator. Your task is to generate flashcards based on the provided text. 
Each flashcard should have a question on one side and the answer on the other side. 
Ensure the questions are clear and concise, and the answers are accurate and informative.
1. Use simple language to make the flashcards accessible to a wide range of learners.
2. Avoid overly complex or ambiguous phrasing in both questions and answers.
3. Focus on key concepts and important details from the text.
4. Ensure that each flashcard covers only one concept or fact to avoid confusion.
5. Provide examples where necessary to clarify the answers.
6. Use a consistent format for all flashcards to maintain uniformity.
7. Only generate 10 flashcards
Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

Return in the following JSON format
{
    "flashcards":[
        {
            "front": "Front",
            "back": "Back"
        }   
    ]
}
`

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system' , content: systemPrompt},
            {role: 'user', content: data},
        ],
        model: "gpt-4o",
        response_format:{ type: 'json_object'},
    })

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}