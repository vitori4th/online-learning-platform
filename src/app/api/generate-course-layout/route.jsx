import { db } from '@/config/db';
import { generateImage, generateStructuredResponse, openAIErrorResponse } from '@/config/openai';
import { coursesTable } from '@/config/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const courseSchema = {
    type: 'object',
    properties: {
        course: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string' },
                level: { type: 'string' },
                includeVideo: { type: 'boolean' },
                noOfChapters: { type: 'integer' },
                bannerImagePrompt: { type: 'string' },
                chapters: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            chapterName: { type: 'string' },
                            duration: { type: 'string' },
                            topics: { type: 'array', items: { type: 'string' } },
                        },
                        required: ['chapterName', 'duration', 'topics'],
                        additionalProperties: false,
                    },
                },
            },
            required: ['name', 'description', 'category', 'level', 'includeVideo', 'noOfChapters', 'bannerImagePrompt', 'chapters'],
            additionalProperties: false,
        },
    },
    required: ['course'],
    additionalProperties: false,
};

const instructions = `Crie a estrutura de um curso conforme os dados fornecidos pelo usuário.
Responda no mesmo idioma do tema informado. Respeite a quantidade de capítulos, o nível e a preferência por vídeo.
Cada capítulo deve ter duração realista e uma lista objetiva de tópicos.
O número noOfChapters deve ser igual ao tamanho de chapters.
bannerImagePrompt deve ser um prompt visual detalhado, sem texto na imagem, para uma ilustração 3D moderna, educacional e em formato paisagem.`;

export async function POST(req) {
    try {
        const { courseId, ...formData } = await req.json();
        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        if (!courseId || !userEmail) {
            return NextResponse.json({ error: 'Usuário ou identificador do curso inválido.' }, { status: 400 });
        }

        const { has } = await auth();
        const hasPremiumAccess = has({ plan: 'free_user' });

        if (!hasPremiumAccess) {
            const courses = await db.select().from(coursesTable)
                .where(eq(coursesTable.userEmail, userEmail));

            if (courses.length >= 1) {
                return NextResponse.json({ resp: 'limit exceed' });
            }
        }

        const courseJson = await generateStructuredResponse({
            name: 'course_layout',
            schema: courseSchema,
            instructions,
            input: formData,
        });
        const bannerImageUrl = await generateImage(courseJson.course.bannerImagePrompt);

        await db.insert(coursesTable).values({
            ...formData,
            courseJson,
            userEmail,
            cid: courseId,
            bannerImageUrl,
        });

        return NextResponse.json({ courseId });
    } catch (error) {
        return openAIErrorResponse(error);
    }
}
