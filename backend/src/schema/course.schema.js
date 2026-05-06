import {z} from "zod";

const createCourseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().min(1, "Subcategory is required"),
    level: z.string().min(1, "Level is required"),
    price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be non-negative")),
    language: z.string().min(1, "Language is required"),
    thumbnail: z.string().min(1, "Thumbnail is required"),
    videoFile: z.string().min(1, "Video file is required"),
    certificateOption: z.string().min(1, "Certificate option is required"),
    whatYouWillLearn: z.string().optional(),
    courseIncludes: z.string().optional(),
})

const updateCourseSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be non-negative")).optional(),
    category: z.string().min(1, "Category is required").optional(),
    language: z.string().min(1, "Language is required").optional(),
    certificateOption: z.string().min(1, "Certificate option is required").optional(),
    whatYouWillLearn: z.string().optional(),
    courseIncludes: z.string().optional(),
    thumbnail: z.string().optional(),
    videoFile: z.string().optional(),
})

const addLectureSchema = z.object({
    title: z.string().min(1, "Title is required"),
    isFree: z.preprocess((val) => {
        if (typeof val === "string") return val === "true";
        return val;
    }, z.boolean().optional()),
    videoFile: z.string().min(1, "Video file is required"),
})

const completeQuizSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"),
})

export {
    createCourseSchema,
    updateCourseSchema,
    addLectureSchema,
    completeQuizSchema
}