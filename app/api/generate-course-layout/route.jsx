import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
    GoogleGenAI,
    ThinkingLevel,
} from '@google/genai';
import axios from 'axios';
import { NextResponse } from 'next/server';

const MOCK_RESPONSE = {
    course: {
        name: "Complete UI/UX Design Masterclass",
        description: "A comprehensive course covering all aspects of modern UI/UX design, from fundamentals to advanced techniques used by industry professionals.",
        category: "Design",
        level: "Beginner",
        includeVideo: true,
        noOfChapters: 4,
        bannerImagePrompt: "Create a modern, flat-style 2D digital illustration representing UI/UX Design. Include mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look.",
        chapters: [
            {
                chapterName: "Introduction to UI/UX Design",
                duration: "1 hour",
                topics: [
                    "What is UI/UX Design?",
                    "Difference between UI and UX",
                    "Design Thinking Process",
                    "Tools Overview: Figma, Adobe XD"
                ]
            },
            {
                chapterName: "User Research & Wireframing",
                duration: "2 hours",
                topics: [
                    "Conducting User Interviews",
                    "Creating User Personas",
                    "Low-fidelity Wireframes",
                    "Prototyping Basics"
                ]
            },
            {
                chapterName: "Visual Design Principles",
                duration: "2 hours",
                topics: [
                    "Typography & Color Theory",
                    "Grid Systems & Layouts",
                    "Component Libraries",
                    "Design Systems"
                ]
            },
            {
                chapterName: "Usability Testing & Handoff",
                duration: "1 hour",
                topics: [
                    "Usability Testing Methods",
                    "Analyzing Test Results",
                    "Developer Handoff with Figma",
                    "Iterating Based on Feedback"
                ]
            }
        ]
    }
};

const MOCK_IMAGE = 'https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fprojects-2025-71366.firebasestorage.app%2Fo%2Fai-guru-lab-images%252F1771550053771.png%3Falt%3Dmedia%26token%3Df5423074-cfb1-421d-b1e1-ca201474781f&w=828&q=75'

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

export const ai = new GoogleGenAI({
    apiKey: process.env['GEMINI_API_KEY'],
});
export async function POST(req) {
    const { courseId, ...formData } = await req.json();
    const user = await currentUser();

    const { has } = await auth();
    const hasPremiumAccess = has({ plan: 'starter' });

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

    //If user already created any course
    if (!hasPremiumAccess) {
        const result = await db.select().from(coursesTable)
            .where(eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress));

        if (result?.length >= 1) {
            return NextResponse.json({ 'resp': 'limit exceed' });
        }
    }

    // const response = await ai.models.generateContent({
    //     model,
    //     config,
    //     contents,
    // });
    // console.log(response.text());
    // const RawResp = response.candidates[0]?.content?.parts[0]?.text;
    // const RawJson = RawResp.replace('```json','').replace('```','');
    // const JSONResp = JSON.parse(RawJson);
    const JSONResp = MOCK_RESPONSE;
    const ImagePrompt = JSONResp.course?.bannerImagePrompt

    //Generate image 
    // const bannerImageUrl = await GenerateImage(ImagePrompt);
    const bannerImageUrl = MOCK_IMAGE;

    //Save to database
    const result = await db.insert(coursesTable).values({
        ...formData,
        courseJson: JSONResp,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        cid: courseId,
        bannerImageUrl: bannerImageUrl
    })

    return NextResponse.json({ courseId });
}

const GenerateImage = async (ImagePrompt) => {
    const BASE_URL = 'https://aigurulab.tech';
    const result = await axios.post(BASE_URL + '/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: ImagePrompt,
            model: 'flux',//'flux'
            aspectRatio: "16:9"//Applicable to Flux model only
        },
        {
            headers: {
                'x-api-key': process?.env?.AI_GURU_LAB_API, // Your API Key
                'Content-Type': 'application/json', // Content Type
            },
        })
    console.log(result.data.image) //Output Result: Base 64 Image
    return result.data.image;
}