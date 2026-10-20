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

const normalizeSearch = (value) => String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function Explore() {
    const [courseList, setCourseList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
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
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const filteredCourses = courseList.filter((course) => {
        // Cursos sem conteúdo gerado só aparecem para quem os criou
        if (!course?.courseContent?.length && course?.userEmail !== userEmail) return false;
        const details = course?.courseJson?.course;
        return [details?.name, details?.description, details?.category, course?.name]
            .some((value) => normalizeSearch(value).includes(searchQuery));
    });

    const onSearch = (event) => {
        event.preventDefault();
        setSearchQuery(normalizeSearch(searchInput));
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <PageHeader
                    items={[{ label: 'Explorar cursos' }]}
                    title="Explore mais cursos"
                    description="Descubra cursos criados pela comunidade e matricule-se para começar a aprender."
                />
                <form onSubmit={onSearch} role="search" className='flex gap-5 max-w-md'>
                    <Input
                        placeholder='Pesquisar'
                        aria-label="Pesquisar cursos"
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                    />
                    <Button type="submit">
                        <Search /> Pesquisar
                    </Button>
                </form>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[0, 1, 2, 3].map((item) => (
                        <Skeleton key={item} className='w-full h-[240px]' />
                    ))}
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredCourses.map((course) => (
                        <CourseCard course={course} key={course.cid} />
                    ))}
                </div>
            ) : (
                <Empty className="border border-dashed rounded-xl">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Compass />
                        </EmptyMedia>
                        <EmptyTitle>Nenhum curso encontrado</EmptyTitle>
                        <EmptyDescription>
                            {searchQuery
                                ? 'Nenhum curso corresponde à pesquisa. Tente outro termo ou pesquise com o campo vazio para ver todos.'
                                : 'Ainda não há cursos disponíveis para explorar. Volte mais tarde.'}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </div>
    )
}

export default Explore
