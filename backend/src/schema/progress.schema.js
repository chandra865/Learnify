import {z} from "zod";

const updateProgressSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    lectureId: z.string().min(1, "Lecture ID is required"),
    watchTime: z.preprocess((val) => Number(val), z.number().min(0)),
    totalDuration: z.preprocess((val) => Number(val), z.number().min(0)),
    totalLectures: z.preprocess((val) => Number(val), z.number().min(1)),
});

const markLectureCompleteSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    lectureId: z.string().min(1, "Lecture ID is required"),
    totalLectures: z.preprocess((val) => Number(val), z.number().min(1)),
});

export {
    updateProgressSchema,
    markLectureCompleteSchema
};
