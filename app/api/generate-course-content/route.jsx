import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route"
import {
    GoogleGenAI,
    ThinkingLevel,
} from '@google/genai';
import axios from "axios";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";
import { coursesTable } from "@/config/schema";

const PROMPT = `Depends on Chapter name and Topic Generate content for each topic HTML and give responde in JSON format.
Schema:{
chapterName:<>,
{
topic:<>,
content:<>
}
}
: User Input:`

const MOCK = `
    {
  "chapterName": "Introduction to UI/UX Design",
  "duration": "1 hour",
  "topics": [
    {
      "topic": "What is UI/UX Design?",
      "content": "<h3>Understanding UI/UX Design</h3><p>UI and UX design are two of the most critical components of digital product development, often working hand-in-hand to create successful websites and applications.</p><ul><li><strong>UX (User Experience):</strong> Focuses on the logical and structural side of a product. It involves researching user needs, mapping out journeys, and ensuring that the product effectively solves a problem for the user.</li><li><strong>UI (User Interface):</strong> Focuses on the aesthetic and interactive elements. This includes the layout, color schemes, typography, buttons, and icons that a user interacts with visually.</li></ul><p>In short, <strong>UX</strong> makes a product useful, while <strong>UI</strong> makes it beautiful and easy to navigate.</p>"
    },
    {
      "topic": "Difference between UI and UX",
      "content": "<h3>UI vs. UX: The Key Differences</h3><p>While they are often used interchangeably, UI and UX serve very different purposes. A common analogy is building a house:</p><ul><li><strong>UX is the foundation:</strong> It’s the blueprint, the plumbing, and the structural integrity that makes the house livable and functional.</li><li><strong>UI is the interior design:</strong> It’s the paint on the walls, the furniture, and the lighting that makes the house inviting and aesthetically pleasing.</li></ul><table><tr><th>Feature</th><th>UX Design</th><th>UI Design</th></tr><tr><td><strong>Focus</strong></td><td>User journey and functionality</td><td>Visual elements and interaction</td></tr><tr><td><strong>Goal</strong></td><td>Problem-solving and usability</td><td>Aesthetics and brand identity</td></tr><tr><td><strong>Tools</strong></td><td>Wireframes, User Flow, Research</td><td>Mockups, Typography, Colors</td></tr></table>"
    },
    {
      "topic": "Design Thinking Process",
      "content": "<h3>The 5 Stages of Design Thinking</h3><p>Design Thinking is a human-centered approach to innovation that integrates the needs of people, the possibilities of technology, and the requirements for business success.</p><ol><li><strong>Empathize:</strong> Research your users' needs and understand their pain points.</li><li><strong>Define:</strong> State your users' needs and problems clearly to create a focused problem statement.</li><li><strong>Ideate:</strong> Brainstorm a wide range of creative solutions without limitations.</li><li><strong>Prototype:</strong> Build low-fidelity or high-fidelity versions of your ideas to test functionality.</li><li><strong>Test:</strong> Share your prototypes with real users to gather feedback and iterate.</li></ol><p>This process is <strong>iterative</strong>, meaning you often loop back to previous steps based on what you learn during testing.</p>"
    },
    {
      "topic": "Tools Overview: Figma, Adobe XD",
      "content": "<h3>Industry-Leading Design Tools</h3><p>To bring UI/UX concepts to life, designers use specialized software. The two most popular tools today are <strong>Figma</strong> and <strong>Adobe XD</strong>.</p><ul><li><strong>Figma:</strong> A web-based tool known for its powerful real-time collaboration. It allows multiple designers to work on the same file simultaneously, making it the industry standard for remote teams.</li><li><strong>Adobe XD:</strong> Part of the Adobe Creative Cloud suite. It is a desktop-based application that integrates seamlessly with Photoshop and Illustrator. It is highly regarded for its auto-animation and voice prototyping features.</li></ul><p>Both tools allow designers to create <strong>wireframes</strong> (low-detail layouts), <strong>high-fidelity mockups</strong> (detailed designs), and <strong>interactive prototypes</strong> (clickable versions of the app).</p>"
    }
  ]
}

`

export async function POST(req) {
    const { courseJson, courseTitle, courseId } = await req.json();

    const tools = [
        {
            googleSearch: {
            }
        },
    ];
    const promises = courseJson?.chapters?.map(async (chapter) => {
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
                        text: PROMPT + JSON.stringify(chapter),
                    },
                ],
            },
        ];

        // const response = await ai.models.generateContent({
        //     model,
        //     config,
        //     contents,
        // });

        // console.log(response.candidates[0].parts[0].text);
        // const RawResp = response.candidates[0]?.content?.parts[0]?.text;
        const RawResp = MOCK;
        const RawJson = RawResp.replace('```json', '').replace('```', '');
        const JSONResp = JSON.parse(RawJson);

        //Get Youtube Videos
        const youtubeData = await GetYoutubeVideo(chapter?.chapterName);

        console.log({
            youtubeVideo: youtubeData,
            courseData: JSONResp
        })
        return {
            youtubeVideo: youtubeData,
            courseData: JSONResp
        };
    })

    const CourseContent = await Promise.all(promises);

    //Save to db
    const dbResp = await db.update(coursesTable).set({
        courseContent: CourseContent
    }).where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
        courseName: courseTitle,
        CourseContent: CourseContent
    });
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const GetYoutubeVideo = async (topic) => {
    const params = {
        part: 'snippet',
        q: topic,
        maxResult: 4,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY
    }
    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const youtubeVideoListResp = resp.data.items;
    const youtubeVideoList = [];
    youtubeVideoListResp.forEach(item => {
        const data = {
            videoId: item.id?.videoId,
            title: item?.snippet?.title
        };
        youtubeVideoList.push(data);
    });
    console.log('youtubeVideoList', youtubeVideoList);

    return youtubeVideoList;
}