import { Button } from "@/components/ui/button";
import axios from "axios";
import { Book, ImageIcon, Loader2Icon, PlayCircle, Settings, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function CourseInfo({ course, viewCourse, editingChapter = false }) {
    const courseLayout = course?.courseJson?.course;
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const router = useRouter();

    const GenerateCourseContent = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/generate-course-content', {
                courseJson: courseLayout,
                courseTitle: course?.name,
                courseId: course?.cid
            })
            console.log(result.data);
            setLoading(false);
            router.replace('/workspace')
            toast("Curso gerado com sucesso!")
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Erro no servidor, tente novamente!")
        }
    }

    const levelLabels = { beginner: "Iniciante", moderate: "Intermediário", advanced: "Avançado" };
    const level = courseLayout?.level ?? course?.level;

    const stats = [
        { icon: Book, label: "Capítulos", value: courseLayout?.chapters?.length ?? course?.noOfChapters ?? "-" },
        { icon: TrendingUp, label: "Nível de dificuldade", value: levelLabels[level?.toLowerCase()] ?? level ?? "-" },
    ];

    return (
        <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
            {course?.bannerImageUrl && !imageError ? (
                <Image src={course.bannerImageUrl} alt={courseLayout?.name ?? "banner"}
                    width={800}
                    height={300}
                    onError={() => setImageError(true)}
                    className="w-full h-40 md:h-48 object-cover"
                />
            ) : (
                <div className="w-full h-40 md:h-48 flex items-center justify-center bg-primary/5">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
            )}

            <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-1.5">
                    <h2 className="font-semibold text-xl">{courseLayout?.name}</h2>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{courseLayout?.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {stats.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-2 text-sm">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">{label}:</span>
                            <span className="font-medium">{value}</span>
                        </div>
                    ))}
                </div>

                {!viewCourse ?
                    <Button className={'w-full sm:w-fit'} onClick={GenerateCourseContent} disabled={loading || editingChapter}>
                        {loading ? <Loader2Icon className="animate-spin" /> : <Settings />}
                        Gerar conteúdo
                    </Button>
                    :
                    <Link href={'/course/' + course?.cid} className="w-full sm:w-fit">
                        <Button className="w-full"> <PlayCircle /> Continuar aprendendo</Button>
                    </Link>
                }
            </div>
        </div>
    )
}

export default CourseInfo;
