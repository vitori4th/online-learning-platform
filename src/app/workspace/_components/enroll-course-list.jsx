"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";
import EnrollCourseCard from "./enroll-course-card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

function EnrollCourseList({ hideWhenEmpty = false, showHeader = true }) {

    const [enrolledCourseList, setEnrolledCourseList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetEnrolledCourse();
    }, [])

    const GetEnrolledCourse = async () => {
        const result = await axios.get('/api/enroll-course');
        setEnrolledCourseList(result.data);
        setLoading(false);
    }

    if (!loading && hideWhenEmpty && enrolledCourseList?.length === 0) {
        return null;
    }

    return (
        <div>
            {showHeader && (
                <>
                    <h2 className="font-bold text-xl">Continue aprendendo seus cursos</h2>
                    <p className="mb-4 text-sm text-muted-foreground">Continue de onde parou nos cursos em que você está matriculado.</p>
                </>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[0, 1, 2].map((item) => (
                        <Skeleton key={item} className="w-full h-[220px] rounded-xl" />
                    ))}
                </div>
            ) : enrolledCourseList?.length === 0 ? (
                <Empty className="border border-dashed rounded-xl">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BookOpen />
                        </EmptyMedia>
                        <EmptyTitle>Nenhum curso em andamento</EmptyTitle>
                        <EmptyDescription>Matricule-se em um curso para continuar aprendendo por aqui.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {enrolledCourseList?.map((course, index) => (
                        <EnrollCourseCard course={course?.courses} enrollCourse={course?.enrollCourse} key={index} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default EnrollCourseList;
