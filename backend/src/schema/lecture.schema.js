import {z} from "zod";

const createLectureSchema = z.object({
    title: z.string().min(1, "Title is required"),
    sectionId: z.string().min(1, "Section ID is required"),
    isFree: z.preprocess((val) => {
        if (typeof val === "string") return val === "true";
        return val;
    }, z.boolean().optional()),
});

const updateLectureSchema = z.object({
    title: z.string().min(1, "Title is required"),
});

const addVideoSchema = z.object({
    videoFileName: z.string().min(1, "Video file name is required"),
    duration: z.preprocess((val) => Number(val), z.number().min(0)),
    lectureId: z.string().min(1, "Lecture ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    sectionId: z.string().min(1, "Section ID is required"),
});

const uploadAwsSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"),
    sectionId: z.string().min(1, "Section ID is required"),
    lectureId: z.string().min(1, "Lecture ID is required"),
    contentType: z.string().min(1, "Content Type is required"),
    fileName: z.string().min(1, "File Name is required"),
});

export {
    createLectureSchema,
    updateLectureSchema,
    addVideoSchema,
    uploadAwsSchema
};
