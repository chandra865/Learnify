import {z} from "zod";

const createSectionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    courseId: z.string().min(1, "Course ID is required"),
});

const updateSectionSchema = z.object({
    title: z.string().min(1, "Title is required"),
});

export {
    createSectionSchema,
    updateSectionSchema
};
