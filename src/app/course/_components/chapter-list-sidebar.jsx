"use client"
import React, { useContext } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { SelectedChapterIndexContext } from "@/context/selected-chapter-index-context";
import { chapterTitle, cn } from "@/lib/utils";
import { CheckCircle2Icon, CircleIcon } from "lucide-react";

function ChapterListLoading() {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-sidebar-border p-5">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
            </div>
            <div className="flex flex-col gap-1.5 p-3">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                    <Skeleton key={item} className="h-10 w-full rounded-lg" />
                ))}
            </div>
        </div>
    )
}

function ChapterListContent({ courseContent, completedChapters, selectedChapterIndex, setSelectedChapterIndex, onSelect }) {
    const totalChapters = courseContent?.length ?? 0;
    const progress = totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;

    return (
        <div className="flex h-full flex-col overflow-y-auto">
            <div className="border-b border-sidebar-border p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-sidebar-foreground">
                        Capítulos ({totalChapters})
                    </h2>
                    <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="mt-3 h-1.5" />
            </div>

            <Accordion type="single" collapsible defaultValue={`${selectedChapterIndex}`} className="flex-1 p-3">
                {courseContent?.map((chapter, index) => {
                    const isCompleted = completedChapters.includes(index);
                    const isActive = selectedChapterIndex === index;

                    return (
                        <AccordionItem value={`${index}`} key={index} className="mb-1.5 border-b-0 last:mb-0">
                            <AccordionTrigger
                                onClick={() => {
                                    setSelectedChapterIndex(index);
                                    onSelect?.();
                                }}
                                className={cn(
                                    "gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent hover:no-underline",
                                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                                )}
                            >
                                <span className="flex min-w-0 items-start gap-2.5 text-left">
                                    {isCompleted
                                        ? <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        : <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                                    <span className="line-clamp-2">{index + 1}. {chapterTitle(chapter?.courseData?.chapterName)}</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1.5 pr-2 pb-2 pl-9">
                                <div className="flex flex-col gap-2 border-l border-sidebar-border pl-3">
                                    {chapter?.courseData?.topics?.map((topic, topicIndex) => (
                                        <p key={topicIndex} className="text-xs leading-relaxed text-muted-foreground">
                                            {topic?.topic}
                                        </p>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}

function ChapterListSidebar({ courseInfo, loading, mobileOpen, setMobileOpen }) {
    const courseContent = courseInfo?.courses?.courseContent;
    const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
    const completedChapters = courseInfo?.enrollCourse?.completedChapters ?? [];

    return (
        <>
            <aside className="hidden w-80 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
                {loading
                    ? <ChapterListLoading />
                    : (
                        <ChapterListContent
                            courseContent={courseContent}
                            completedChapters={completedChapters}
                            selectedChapterIndex={selectedChapterIndex}
                            setSelectedChapterIndex={setSelectedChapterIndex}
                        />
                    )}
            </aside>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="w-80 gap-0 bg-sidebar p-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Capítulos do curso</SheetTitle>
                    </SheetHeader>
                    {loading
                        ? <ChapterListLoading />
                        : (
                            <ChapterListContent
                                courseContent={courseContent}
                                completedChapters={completedChapters}
                                selectedChapterIndex={selectedChapterIndex}
                                setSelectedChapterIndex={setSelectedChapterIndex}
                                onSelect={() => setMobileOpen?.(false)}
                            />
                        )}
                </SheetContent>
            </Sheet>
        </>
    )
}

export default ChapterListSidebar;
