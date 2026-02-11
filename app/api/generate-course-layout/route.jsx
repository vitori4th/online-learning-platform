import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import {
    GoogleGenAI,
    ThinkingLevel,
} from '@google/genai';
import { NextResponse } from 'next/server';

const PROMPT = `
    Genrate Learning Course depends on following
details. In which Make sure to add Course Name,
Description, Course Banner Image Prompt (Create a
modern, flat-style 2D digital illustration representing
user Topic. Include UI/UX elements such as mockup
screens, text blocks, icons, buttons, and creative
workspace tools. Add symbolic elements related to
user Course, like sticky notes, design components,
and visual aids. Use a vibrant color palette (blues,
purples, oranges) with a clean, professional look. The
illustration should feel creative, tech-savvy, and
educational, ideal for visualizing concepts in user
Course) for Course Banner in 3d format Chapter
Name, , Topic under each chapters , Duration for
each chapters etc, in JSON format only
Schema:
"course": {
"name": "string",
"description": "string",
"category": "string",
"level": "string",
"includeVideo": "boolean",
"noOfChapters": "number",
"bannerImagePrompt": "string",
"chapters": [
"chapterName": "string",
"duration": "string",
"topics": [
"string"
, User Input:

`
export async function POST(req) {
    const formData = await req.json();
    const user = currentUser();

    const ai = new GoogleGenAI({
        apiKey: process.env['GEMINI_API_KEY'],
    });
    const tools = [
        {
            googleSearch: {
            }
        },
    ];
    const config = {
        thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
        },
        tools,
    };
    const model = 'gemini-3-flash-preview';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: PROMPT + JSON.stringify(formData),
                },
            ],
        },
    ];

    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    });
    console.log(response.text())

    //Save to database
    // const result = await db.insert(coursesTable).values({
    //     ...formData,
    //     courseJson: response.text(),
    //     userEmail: user?.primayEmailAddress?.emailAddress
    // })

    return NextResponse.json(response.text());
}

