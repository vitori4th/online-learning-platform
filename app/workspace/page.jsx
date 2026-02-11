import React from "react";
import WellcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";

function Workspace({children}){
    return (
       <div>
            <WellcomeBanner/>
            <CourseList/>
       </div>
    )
}

export default Workspace;