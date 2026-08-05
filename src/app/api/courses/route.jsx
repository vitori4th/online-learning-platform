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