"use client"
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CourseInfo from '../../_components/course-info';
import ChapterTopicList from '../../_components/chapter-topic-list';
import PageHeader from '../../_components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/nextjs';

function EditCourse({ viewCourse = false }) {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState();
    const [editingChapter, setEditingChapter] = useState(false);
    const { user } = useUser();
    const isAuthor = !!user?.primaryEmailAddress?.emailAddress &&
        course?.userEmail === user.primaryEmailAddress.emailAddress;
    const canEditChapters = !viewCourse && isAuthor && !course?.courseContent?.length;

    useEffect(() => {
        getCourseInfo();
    }, [])

    const getCourseInfo = async () => {
        setLoading(true);
        const result = await axios.get('/api/courses?courseId=' + courseId);
        setLoading(false);
        setCourse(result.data);
    }
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                items={[{ label: viewCourse ? 'Detalhes do curso' : 'Editar curso' }]}
                title={viewCourse ? 'Detalhes do curso' : 'Editar curso'}
                description={viewCourse
                    ? 'Veja as informações do curso e continue de onde parou.'
                    : 'Revise as informações geradas pela IA e crie o conteúdo completo do curso.'}
            />

            {loading ? (
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-[240px] w-full rounded-2xl" />
                    <Skeleton className="h-40 w-full rounded-2xl" />
                </div>
            ) : (
                <>
                    <CourseInfo course={course} viewCourse={viewCourse || !isAuthor} editingChapter={editingChapter}/>
                    <ChapterTopicList course={course} canEdit={canEditChapters} onSaved={setCourse} onEditingChange={setEditingChapter} />
                </>
            )}
        </div>
    )
}

export default EditCourse
