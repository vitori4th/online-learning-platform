"use client"
import AppHeader from '@/app/workspace/_components/app-header'
import React, { useEffect, useState } from 'react'
import ChapterListSidebar from '../_components/chapter-list-sidebar'
import ChapterContent from '../_components/chapter-content'
import { useParams } from 'next/navigation'
import axios from 'axios'

function Course() {
    const { courseId } = useParams();
    const [courseInfo, setCourseInfo] = useState();
    const [loading, setLoading] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        GetEnrolledCourseById();
    }, [])

    const GetEnrolledCourseById = async () => {
        const result = await axios.get('/api/enroll-course?courseId=' + courseId);
        setCourseInfo(result.data);
        setLoading(false);
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <AppHeader
                hideSidebar
                backHref="/workspace/my-learning"
                title={loading ? undefined : courseInfo?.courses?.name}
                onMenuClick={() => setMobileOpen(true)}
            />

            <div className="flex min-h-0 flex-1">
                <ChapterListSidebar
                    courseInfo={courseInfo}
                    loading={loading}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />
                <ChapterContent
                    courseInfo={courseInfo}
                    loading={loading}
                    refreshData={() => GetEnrolledCourseById()}
                />
            </div>
        </div>
    )
}

export default Course
