import { db } from '@/config/db';
import { generateStructuredResponse, openAIErrorResponse } from '@/config/openai';
import { coursesTable } from '@/config/schema';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const chapterSchema = {
    type: 'object',
    properties: {
        chapterName: { type: 'string' },
        duration: { type: 'string' },
        topics: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    topic: { type: 'string' },
                    content: { type: 'string' },
                },
                required: ['topic', 'content'],
                additionalProperties: false,
            },
        },
    },
    required: ['chapterName', 'duration', 'topics'],
    additionalProperties: false,
};

const instructions = `Produza uma aula completa para o capítulo fornecido.
Preserve exatamente o nome, a duração e todos os tópicos recebidos, na mesma ordem e idioma.
Para cada tópico, escreva conteúdo didático e correto em HTML semântico.
Use somente elementos de conteúdo como h2, h3, p, ul, ol, li, strong, em, table, thead, tbody, tr, th, td, pre e code.
Não inclua html, head, body, scripts, estilos inline ou Markdown.`;

export async function POST(req) {
    try {
        const { courseJson, courseTitle, courseId } = await req.json();

        if (!courseId || !Array.isArray(courseJson?.chapters)) {
            return NextResponse.json({ error: 'Dados do curso inválidos.' }, { status: 400 });
        }

        const [course] = await db.select({ includeVideo: coursesTable.includeVideo })
            .from(coursesTable)
            .where(eq(coursesTable.cid, courseId));

        if (!course) {
            return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
        }

        const courseContent = await Promise.all(courseJson.chapters.map(async (chapter) => {
            const [courseData, youtubeVideo] = await Promise.all([
                generateStructuredResponse({
                    name: 'chapter_content',
                    schema: chapterSchema,
                    instructions,
                    input: chapter,
                }),
                course.includeVideo === true ? getYoutubeVideos(chapter.chapterName) : [],
            ]);

            return { youtubeVideo, courseData };
        }));

        await db.update(coursesTable)
            .set({ courseContent })
            .where(eq(coursesTable.cid, courseId));

        return NextResponse.json({ courseName: courseTitle, CourseContent: courseContent });
    } catch (error) {
        return openAIErrorResponse(error);
    }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const getYoutubeVideos = async (topic) => {
    if (!process.env.YOUTUBE_API_KEY) return [];

    // Uma falha na busca de vídeos não pode impedir a geração do curso (RNF03)
    try {
        const response = await axios.get(YOUTUBE_BASE_URL, {
            params: {
                part: 'snippet',
                q: topic,
                maxResults: 4,
                type: 'video',
                key: process.env.YOUTUBE_API_KEY,
            },
            timeout: 10000,
        });

        return (response.data?.items ?? []).map((item) => ({
            videoId: item.id?.videoId,
            title: item.snippet?.title,
        }));
    } catch (error) {
        console.error('YouTube search failed', { topic, message: error?.message });
        return [];
    }
};
