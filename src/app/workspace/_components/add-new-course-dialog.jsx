import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Loader2Icon, Sparkle } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MAX_CHAPTERS = 20;

function AddNewCourseDialog({ children }) {
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        includeVideo: false,
        noOfChapters: 1,
        category: '',
        level: ''
    });
    const router = useRouter();

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    // Retorna a primeira mensagem de erro encontrada ou null se o formulário for válido (RNF06)
    const validateForm = () => {
        const noOfChapters = Number(formData.noOfChapters);

        if (!formData.name.trim()) return 'Informe o nome do curso.';
        if (!Number.isInteger(noOfChapters) || noOfChapters < 1 || noOfChapters > MAX_CHAPTERS) {
            return `Informe um número de capítulos entre 1 e ${MAX_CHAPTERS}.`;
        }
        if (!formData.level) return 'Selecione o nível de dificuldade.';
        return null;
    }

    const onGenerate = async () => {
        const validationError = validateForm();
        if (validationError) {
            toast.warning(validationError);
            return;
        }

        const courseId = uuidv4();
        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                name: formData.name.trim(),
                noOfChapters: Number(formData.noOfChapters),
                courseId: courseId
            });
            /* Redirecionamento para assinatura desativado temporariamente para o TCC.
            if (result.data.resp == 'limit exceed') {
                toast.warning('Assine um plano para continuar!');
                router.push('/workspace/billing')
                setLoading(false);
                return;
            }
            */
            setLoading(false);
            router.push('/workspace/edit-course/' + result.data?.courseId);

        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.error || 'Não foi possível gerar o curso. Tente novamente.');
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar curso com IA</DialogTitle>
                    <DialogDescription>
                        Preencha os detalhes abaixo para gerar a estrutura inicial do curso com ajuda da IA.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup className="gap-3">
                    <Field className="gap-1">
                        <FieldLabel htmlFor="course-name">Nome do curso</FieldLabel>
                        <Input
                            id="course-name"
                            placeholder="Nome do curso"
                            onChange={(event) => onHandleInputChange('name', event?.target.value)}
                        />
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="course-description">Descricao do curso (opcional)</FieldLabel>
                        <Textarea
                            id="course-description"
                            placeholder="Descricao do curso"
                            onChange={(event) => onHandleInputChange('description', event?.target.value)}
                        />
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="course-chapters">Numero de capitulos</FieldLabel>
                        <Input
                            id="course-chapters"
                            placeholder="Numero de capitulos"
                            type='number'
                            onChange={(event) => onHandleInputChange('noOfChapters', event?.target.value)}
                        />
                    </Field>
                    <Field orientation="horizontal" className="items-center!">
                        <FieldContent className="gap-1">
                            <FieldLabel htmlFor="include-video">Incluir video</FieldLabel>
                            <FieldDescription>
                                Ative para pedir sugestoes de conteudo com suporte a video nas aulas do curso.
                            </FieldDescription>
                        </FieldContent>

                        <Switch
                            id="include-video"
                            checked={formData?.includeVideo}
                            onCheckedChange={(checked) => onHandleInputChange('includeVideo', checked)}
                        />
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="course-level">Nivel de dificuldade</FieldLabel>
                        <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                            <SelectTrigger id="course-level" className="w-full">
                                <SelectValue placeholder="Selecione o nivel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="beginner">Iniciante</SelectItem>
                                    <SelectItem value="moderate">Intermediario</SelectItem>
                                    <SelectItem value="advanced">Avancado</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="course-category">Categoria</FieldLabel>
                        <Input
                            id="course-category"
                            placeholder="Categoria (separada por virgula)"
                            onChange={(event) => onHandleInputChange('category', event?.target.value)}
                        />
                    </Field>
                    <div className="mt-2">
                        <Button className={'w-full'} onClick={onGenerate} disabled={loading}>
                            {loading ? <Loader2Icon className="animate-spin" /> :
                                <Sparkle />} Gerar curso</Button>
                    </div>
                </FieldGroup>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewCourseDialog;
