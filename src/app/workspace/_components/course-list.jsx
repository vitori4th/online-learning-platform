"use client"
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import AddNewCourseDialog from "./add-new-course-dialog";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import CourseCard from "./course-card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Plus } from "lucide-react";

function CourseList() {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        user && GetCourseList();
    }, [user]);

    const GetCourseList = async () => {
        setLoading(true);
        const result = await axios.get('/api/courses');
        setCourseList(result.data);
        setLoading(false);
    }

    return (
        <div>
            <h2 className="font-bold text-xl">Lista de cursos</h2>
            <p className="mb-4 text-sm text-muted-foreground">Cursos que você criou. Gere o conteúdo ou continue aprendendo.</p>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[0, 1, 2].map((item) => (
                        <Skeleton key={item} className="w-full h-[220px] rounded-xl" />
                    ))}
                </div>
            ) : courseList?.length == 0 ? (
                <Empty className="border border-dashed rounded-xl">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <GraduationCap />
                        </EmptyMedia>
                        <EmptyTitle>Você ainda não criou nenhum curso</EmptyTitle>
                        <EmptyDescription>Crie seu primeiro curso com IA para começar a aprender.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <AddNewCourseDialog>
                            <Button><Plus /> Criar seu primeiro curso</Button>
                        </AddNewCourseDialog>
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {courseList?.map((course, index)=>(
                        <CourseCard course={course} key={index}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CourseList;
