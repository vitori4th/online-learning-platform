import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
        console.log(formData)
    }

    const onGenerate = async () => {
        console.log(formData)
        const courseId = uuidv4();
        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                courseId: courseId
            });
            if (result.data.resp == 'limit exceed') {
                toast.warning('Please subscribe to plan!');
                router.push('/worskpace/billing')
            }
            setLoading(false);
            router.push('/wokspace/edit-course/' + result.data?.courseId);

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Course Using AI</DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col gap-4 mt-3">
                            <div>
                                <label>Course Name</label>
                                <Input placeholder="Corse Name"
                                    onChange={(event) => onHandleInputChange('name', event?.target.value)} />
                            </div>
                            <div>
                                <label>Course Description (Optional)</label>
                                <Textarea placeholder="Corse Description"
                                    onChange={(event) => onHandleInputChange('description', event?.target.value)} />
                            </div>
                            <div>
                                <label>No. Of Chapters</label>
                                <Input placeholder="No. Of Chapters" type='number'
                                    onChange={(event) => onHandleInputChange('noOfChapters', event?.target.value)} />
                            </div>
                            <div className="flex gap-3 items-center">
                                <label>Include Video</label>
                                <Switch onCheckedChange={() => onHandleInputChange('includeVideo', !formData?.includeVideo)} />
                            </div>
                            <div>
                                <label>Difficulty Level</label>
                                <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Difficulty Leve" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="moderate">Moderate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label>Category</label>
                                <Input placeholder="Category (Separeted by Comma)"
                                    onChange={(event) => onHandleInputChange('category', event?.target.value)} />
                            </div>
                            <div className="mt-5">
                                <Button className={'w-full'} onClick={onGenerate} disabled={loading}>
                                    {loading ? <Loader2Icon className="animate-spin" /> :
                                        <Sparkle />} Generate Course</Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewCourseDialog;