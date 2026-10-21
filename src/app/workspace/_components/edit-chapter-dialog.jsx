"use client";

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel } from '@/components/ui/field';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Loader2Icon, Pencil } from 'lucide-react';

export default function EditChapterDialog({ courseId, chapter, chapterIndex, onSaved, onEditingChange }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [draft, setDraft] = useState({ chapterName: '', duration: '', topics: '' });
    const prefix = `chapter-${chapterIndex}`;

    const changeOpen = (nextOpen) => {
        if (saving) return;
        if (nextOpen) {
            setDraft({ chapterName: chapter.chapterName ?? '', duration: chapter.duration ?? '', topics: (chapter.topics ?? []).join('\n') });
        }
        setOpen(nextOpen);
        onEditingChange(nextOpen);
    };

    const save = async (event) => {
        event.preventDefault();
        if (saving) return;
        const updatedChapter = {
            chapterName: draft.chapterName.trim(),
            duration: draft.duration.trim(),
            topics: draft.topics.split('\n').map((topic) => topic.trim()).filter(Boolean),
        };
        if (!updatedChapter.chapterName || !updatedChapter.duration || !updatedChapter.topics.length) {
            toast.warning('Informe nome, duração e pelo menos um tópico.');
            return;
        }
        setSaving(true);
        try {
            const result = await axios.patch('/api/courses', { courseId, chapterIndex, chapter: updatedChapter });
            onSaved(result.data);
            setOpen(false);
            onEditingChange(false);
            toast.success('Capítulo atualizado!');
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Não foi possível salvar o capítulo. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" aria-label={`Editar capítulo ${chapterIndex + 1}`}>
                    <Pencil className="h-4 w-4" /> Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto" showCloseButton={!saving} onEscapeKeyDown={(event) => { if (saving) event.preventDefault(); }} onInteractOutside={(event) => { if (saving) event.preventDefault(); }}>
                <DialogHeader>
                    <DialogTitle>Editar capítulo {chapterIndex + 1}</DialogTitle>
                    <DialogDescription>Revise as informações antes de gerar o conteúdo do curso.</DialogDescription>
                </DialogHeader>
                <form onSubmit={save} className="flex flex-col gap-4">
                    <Field>
                        <FieldLabel htmlFor={`${prefix}-name`}>Nome do capítulo</FieldLabel>
                        <Input id={`${prefix}-name`} value={draft.chapterName} disabled={saving} onChange={(event) => setDraft({ ...draft, chapterName: event.target.value })} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor={`${prefix}-duration`}>Duração</FieldLabel>
                        <Input id={`${prefix}-duration`} value={draft.duration} placeholder="Ex.: 1 hora" disabled={saving} onChange={(event) => setDraft({ ...draft, duration: event.target.value })} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor={`${prefix}-topics`}>Tópicos (um por linha)</FieldLabel>
                        <Textarea id={`${prefix}-topics`} rows={6} value={draft.topics} disabled={saving} onChange={(event) => setDraft({ ...draft, topics: event.target.value })} />
                    </Field>
                    <DialogFooter>
                        <Button type="button" variant="outline" disabled={saving} onClick={() => changeOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={saving}>{saving && <Loader2Icon className="animate-spin" />}Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
