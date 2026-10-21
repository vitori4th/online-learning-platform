import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { enrollCourseTable } from "@/config/schema";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId');
    const user = await currentUser();

    if (courseId == 0) {
        const result = await db.select().from(coursesTable)
            .leftJoin(enrollCourseTable, and(
                eq(coursesTable.cid, enrollCourseTable.cid),
                eq(enrollCourseTable.userEmail, user?.primaryEmailAddress?.emailAddress)
            ));

        const courses = result.map((row) => ({
            ...row.courses,
            isEnrolled: !!row.enrollCourse
        }));

        return NextResponse.json(courses);
    }
    else if (courseId) {
        const result = await db.select().from(coursesTable)
            .where(eq(coursesTable.cid, courseId));

        console.log(result)
        return NextResponse.json(result[0]);
    } else {
        const result = await db.select().from(coursesTable)
            .where(eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(coursesTable.id));

        console.log(result)

        return NextResponse.json(result);
    }
}

export async function PATCH(req) {
    try {
        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (!userEmail) {
            return NextResponse.json({ error: 'Faça login para editar o curso.' }, { status: 401 });
        }

        const { courseId, chapterIndex, chapter } = await req.json();
        if (typeof courseId !== 'string' || !courseId.trim() ||
            !Number.isInteger(chapterIndex) || chapterIndex < 0 ||
            typeof chapter?.chapterName !== 'string' || !chapter.chapterName.trim() ||
            typeof chapter?.duration !== 'string' || !chapter.duration.trim() ||
            !Array.isArray(chapter?.topics) || chapter.topics.length === 0 ||
            chapter.topics.some((topic) => typeof topic !== 'string' || !topic.trim())) {
            return NextResponse.json({ error: 'Informe nome, duração e pelo menos um tópico válido.' }, { status: 400 });
        }

        const [course] = await db.select().from(coursesTable)
            .where(eq(coursesTable.cid, courseId));
        if (!course) {
            return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
        }
        if (course.userEmail !== userEmail) {
            return NextResponse.json({ error: 'Apenas o autor pode editar o curso.' }, { status: 403 });
        }
        if (course.courseContent?.length) {
            return NextResponse.json({ error: 'Os capítulos só podem ser editados antes de gerar o conteúdo.' }, { status: 409 });
        }

        const chapters = course.courseJson?.course?.chapters;
        if (!Array.isArray(chapters) || chapterIndex >= chapters.length) {
            return NextResponse.json({ error: 'Capítulo não encontrado.' }, { status: 404 });
        }

        const updatedChapters = chapters.map((existing, index) => index === chapterIndex ? {
            ...existing,
            chapterName: chapter.chapterName.trim(),
            duration: chapter.duration.trim(),
            topics: chapter.topics.map((topic) => topic.trim()),
        } : existing);
        const courseJson = {
            ...course.courseJson,
            course: { ...course.courseJson.course, chapters: updatedChapters },
        };
        const [updated] = await db.update(coursesTable).set({ courseJson })
            .where(and(eq(coursesTable.cid, courseId), eq(coursesTable.userEmail, userEmail)))
            .returning();
        if (!updated) {
            return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
        }
        console.error('Chapter update failed', { message: error?.message });
        return NextResponse.json({ error: 'Não foi possível salvar o capítulo.' }, { status: 500 });
    }
}
