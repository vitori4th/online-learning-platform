import { Button } from "@/components/ui/button";
import { ImageIcon, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function EnrollCourseCard({ course, enrollCourse }) {
    const courseJson = course?.courseJson?.course;
    const [imageError, setImageError] = useState(false);

    const calculatePerProgress = () => {
        const completedChapters = enrollCourse?.completedChapters?.length ?? 0;
        const totalChapters = course?.courseContent?.length ?? 0;

        if (totalChapters === 0) return 0;

        return Math.min(100, Math.max(0, Math.round((completedChapters / totalChapters) * 100)));
    }

    const progress = calculatePerProgress();

    return (
        <div className="relative bg-card border rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/15 z-10">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
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
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progresso</span>
                    <span className="text-primary font-medium">{progress}%</span>
                </div>

                <Link href={'/workspace/view-course/' + course?.cid}>
                    <Button className={'w-full'}><PlayCircle /> Continue aprendendo</Button>
                </Link>
            </div>
        </div>
    )
}

export default EnrollCourseCard;
