"use client"
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Compass, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CourseCard from '../_components/course-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '../_components/page-header';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

function Explore() {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        user && GetCourseList();
    }, [user]);

    const GetCourseList = async () => {
        setLoading(true);
        const result = await axios.get('/api/courses?courseId=0');
        setCourseList(result.data);
        setLoading(false);
    }
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <PageHeader
                    items={[{ label: 'Explorar cursos' }]}
                    title="Explore mais cursos"
                    description="Descubra cursos criados pela comunidade e matricule-se para começar a aprender."
                />
                <div className='flex gap-5 max-w-md'>
                    <Input placeholder='Pesquisar' />
                    <Button>
                        <Search /> Pesquisar
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[0, 1, 2, 3].map((item) => (
                        <Skeleton key={item} className='w-full h-[240px]' />
                    ))}
                </div>
            ) : courseList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {courseList.map((course, index) => (
                        <CourseCard course={course} key={index} />
                    ))}
                </div>
            ) : (
                <Empty className="border border-dashed rounded-xl">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Compass />
                        </EmptyMedia>
                        <EmptyTitle>Nenhum curso encontrado</EmptyTitle>
                        <EmptyDescription>Ainda não há cursos disponíveis para explorar. Volte mais tarde.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </div>
    )
}

export default Explore
