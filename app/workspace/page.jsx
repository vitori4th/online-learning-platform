import React from "react";
import WellcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";
import EnrollCourseList from "./_components/EnrollCourseList";

function Workspace({children}){
    return (
       <div>
            <WellcomeBanner/>
            <EnrollCourseList/>
            <CourseList/>
       </div>
    )
}

export default Workspace;