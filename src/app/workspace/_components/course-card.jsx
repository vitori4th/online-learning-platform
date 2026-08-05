import { Button } from "@/components/ui/button";
import axios from "axios";
import { Book, ImageIcon, LoaderCircle, PlayCircle, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

function CourseCard({ course }) {
    const courseJson = course?.courseJson?.course;
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(course?.isEnrolled ?? false);

    const onEnrollCourse = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/enroll-course', {
                courseId: course?.cid,
            })
            console.log(result.data);
            if(result.data.resp){
                toast.warning('Você já está matriculado!');
                setIsEnrolled(true);
                setLoading(false);
                return;
            }
            toast.success('Matrícula realizada!')
            setIsEnrolled(true);
            setLoading(false);
        } catch (error) {
            toast.error('Erro no servidor');
            setLoading(false);
        }
    }

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            {course?.bannerImageUrl && !imageError ? (
                <Image src={course.bannerImageUrl} alt={course?.name}
                    width={400}
                    height={300}
                    onError={() => setImageError(true)}
                    className="w-full h-32 rounded-t-xl object-cover"
                />
            ) : (
                <div className="w-full h-32 flex items-center justify-center bg-primary/5 rounded-t-xl">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
            )}
            <div className="p-4 flex flex-col gap-3">
                <h2 className="font-semibold text-lg line-clamp-1">{courseJson?.name}</h2>
                <p className="line-clamp-2 text-muted-foreground text-sm">{courseJson?.description}</p>
                <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
                    <Book className="text-primary h-4 w-4" /> {courseJson?.noOfChapters} capítulos
                </div>
                {course?.courseContent?.length ?
                    isEnrolled ?
                        <Link href={'/course/' + course?.cid} className="w-full">
                            <Button className="w-full">
                                <PlayCircle /> Acessar curso
                            </Button>
                        </Link>
                        :
                        <Button onClick={onEnrollCourse} disabled={loading} className="w-full">
                            {loading ? <LoaderCircle className="animate-spin" /> : <PlayCircle />}
                            Matricular-se
                        </Button>
                    :
                    <Link href={'/workspace/edit-course/' + course?.cid} className="w-full">
                        <Button variant="outline" className="w-full">
                            <Settings /> Gerar curso
                        </Button>
                    </Link>
                }
            </div>
        </div>
    )
}

export default CourseCard;
