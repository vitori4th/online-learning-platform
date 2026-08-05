import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { email, name } = await req.json();
    const normalizedEmail = email?.trim();
    const normalizedName = name?.trim() || normalizedEmail?.split('@')[0] || 'Usuario';

    if (!normalizedEmail) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    //if user already exist?
    const users = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail));

    //if not then insert new user  
    if (users?.length == 0) {
        const result = await db.insert(usersTable).values({
            name: normalizedName,
            email: normalizedEmail
        }).returning(usersTable);

        console.log('aqui',result)
        return  NextResponse.json(result);
    }

    return NextResponse.json(users[0])
}
