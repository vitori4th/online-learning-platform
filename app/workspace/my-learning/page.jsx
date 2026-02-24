import React from 'react'
import WellcomeBanner from '../_components/WelcomeBanner'
import EnrollCourseList from '../_components/EnrollCourseList'

function MyLearning({ viewCourse = false }) {

    return (
        <div>
            <WellcomeBanner />
            <h2 className='font-bold text-2xl mt-5'>My Learning</h2>
            <EnrollCourseList />
        </div>
    )
}

export default MyLearning