import React from 'react'
import EnrollCourseList from '../_components/enroll-course-list'
import PageHeader from '../_components/page-header'

export const metadata = {
    title: "Meu aprendizado",
    description: "Acompanhe o progresso dos cursos em que você está matriculado.",
};

function MyLearning() {

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                items={[{ label: 'Meu aprendizado' }]}
                title="Meu aprendizado"
                description="Acompanhe o progresso dos cursos em que você está matriculado e continue de onde parou."
            />
            <EnrollCourseList showHeader={false} />
        </div>
    )
}

export default MyLearning
