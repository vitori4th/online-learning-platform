"use client"
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectedChapterIndexContext } from "@/context/selected-chapter-index-context";
import axios from "axios";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useState } from "react";
import YouTube from "react-youtube";
import { toast } from "sonner";

function ChapterContentLoading() {
    return (
        <div className="flex max-w-5xl flex-col gap-8 p-6 md:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-7 w-72 max-w-full" />
                </div>
                <Skeleton className="h-9 w-48 shrink-0 rounded-md" />
            </div>

            <div className="flex flex-col gap-5">
                {[0, 1, 2].map((item) => (
                    <div key={item} className="rounded-xl border border-border bg-card p-5">
                        <div className="mb-3 flex items-center gap-2.5">
                            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                            <Skeleton className="h-4 w-56 max-w-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-3.5 w-4/5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ChapterContent({ courseInfo, loading, refreshData }) {
    const { courseId } = useParams();
    const enrollCourse = courseInfo?.enrollCourse;
    const courseContent = courseInfo?.courses?.courseContent;
    const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);
    const chapter = courseContent?.[selectedChapterIndex];
    const videoData = chapter?.youtubeVideo;
    const topics = chapter?.courseData?.topics;
    const completedChapters = enrollCourse?.completedChapters ?? [];
    const isCompleted = completedChapters.includes(selectedChapterIndex);
    const [saving, setSaving] = useState(false);

    const markChapterCompleted = async () => {
        setSaving(true);
        await axios.put('/api/enroll-course', {
            courseId: courseId,
            completedChapter: [...completedChapters, selectedChapterIndex]
        });
        await refreshData();
        toast.success('Capítulo marcado como concluído!');
        setSaving(false);
    }

    const markIncompleteChapter = async () => {
        setSaving(true);
        await axios.put('/api/enroll-course', {
            courseId: courseId,
            completedChapter: completedChapters.filter((item) => item !== selectedChapterIndex)
        });
        await refreshData();
        toast.success('Capítulo marcado como não concluído!');
        setSaving(false);
    }

    if (loading) {
        return (
            <main className="min-w-0 flex-1 overflow-y-auto">
                <ChapterContentLoading />
            </main>
        )
    }

    return (
        <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-8 p-6 md:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Capítulo {selectedChapterIndex + 1} de {courseContent?.length}
                        </span>
                        <h1 className="text-xl font-semibold md:text-2xl">{chapter?.courseData?.chapterName}</h1>
                    </div>

                    {!isCompleted ? (
                        <Button onClick={markChapterCompleted} disabled={saving} className="shrink-0">
                            {saving ? <Loader2Icon className="animate-spin" /> : <CheckCircle2Icon />}
                            Marcar como concluído
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={markIncompleteChapter} disabled={saving} className="shrink-0">
                            {saving ? <Loader2Icon className="animate-spin" /> : <XCircleIcon />}
                            Marcar como não concluído
                        </Button>
                    )}
                </div>

                {videoData?.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-foreground">Vídeos relacionados</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {videoData.slice(0, 2).map((video, index) => (
                                <div key={index} className="overflow-hidden rounded-xl border border-border [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full">
                                    <YouTube videoId={video?.videoId} opts={{ width: "100%" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-5">
                    {topics?.map((topic, index) => (
                        <section key={index} className="rounded-xl border border-border bg-card p-5">
                            <h3 className="mb-3 flex items-center gap-2.5 text-base font-semibold text-foreground">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                    {index + 1}
                                </span>
                                {topic?.topic}
                            </h3>
                            <div
                                className="text-sm leading-7 text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_h3]:mt-4 [&_h3]:font-semibold [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
                                dangerouslySetInnerHTML={{ __html: topic?.content }}
                            />
                        </section>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default ChapterContent;
