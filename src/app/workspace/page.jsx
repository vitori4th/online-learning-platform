import React from "react";
import WelcomeBanner from "./_components/welcome-banner";
import CourseList from "./_components/course-list";
import EnrollCourseList from "./_components/enroll-course-list";

export const metadata = {
    title: "Painel",
    description: "Acompanhe seus cursos, continue aprendendo e crie novos conteúdos com IA.",
};

function Workspace(){
    return (
       <div className="flex flex-col gap-8">
            <WelcomeBanner/>
            <EnrollCourseList hideWhenEmpty/>
            <CourseList/>
       </div>
    )
}

export default Workspace;