// import { useParams } from 'next/navigation';
import React from 'react'
import EditCourse from '../../edit-course/[courseId]/page';

export const metadata = {
    title: "Curso",
    description: "Veja os detalhes do curso e continue de onde parou.",
};

function ViewCourse() {
    // const { courseId } = useParams();

    return (
        <div>
           <EditCourse viewCourse={true}/>
        </div>
    )
}

export default ViewCourse