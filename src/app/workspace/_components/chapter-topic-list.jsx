import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock } from "lucide-react";
import React from "react";
import { chapterTitle } from "@/lib/utils";
import EditChapterDialog from './edit-chapter-dialog';

function ChapterTopicList({ course, canEdit = false, onSaved, onEditingChange }) {
    const courseLayout = course?.courseJson?.course;
    const chapters = courseLayout?.chapters ?? [];

    return (
        <div className="flex flex-col gap-4">
            <h2 className="font-medium text-2xl">Capítulos e tópicos</h2>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                    {chapters.map((chapter, index) => (
                        <AccordionItem value={`${index}`} key={index} className="px-5">
                            <div className="flex items-center gap-3">
                                <div className="min-w-0 flex-1">
                                    <AccordionTrigger className="items-center gap-3 hover:no-underline">
                                        <span className="min-w-0 truncate text-left flex-1 text-sm font-medium">
                                            <span className="text-primary">Capítulo {index + 1}:</span> {chapterTitle(chapter?.chapterName)}
                                        </span>
                                        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {chapter?.duration?.replace(/\bhours?\b/gi, "horas")}</span>
                                            <span>&middot;</span>
                                            <span>{chapter?.topics?.length ?? 0} tópicos</span>
                                        </div>
                                    </AccordionTrigger>
                                </div>
                                {canEdit && (
                                    <EditChapterDialog courseId={course.cid} chapter={chapter} chapterIndex={index} onSaved={onSaved} onEditingChange={onEditingChange} />
                                )}
                            </div>
                            <AccordionContent>
                                <ul className="flex flex-col gap-2">
                                    {chapter?.topics?.map((topic, topicIndex) => (
                                        <li key={topicIndex} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                                {topicIndex + 1}
                                            </span>
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default ChapterTopicList;
