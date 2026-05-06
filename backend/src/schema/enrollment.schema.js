import {z} from "zod";

const completeLectureSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    lectureId: z.string().min(1, "Lecture ID is required"),
});

export {
    completeLectureSchema
};
