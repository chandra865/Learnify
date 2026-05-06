import {z} from "zod";

const questionSchema = z.object({
    questionText: z.string().min(1, "Question text is required"),
    options: z.array(z.string()).min(2, "At least two options are required"),
    correctAnswer: z.string().min(1, "Correct answer is required"),
});

const createQuizSchema = z.object({
    title: z.string().min(1, "Title is required"),
    lectureId: z.string().optional(),
    courseId: z.string().optional(),
    questions: z.array(questionSchema).min(1, "At least one question is required"),
    passingScore: z.preprocess((val) => Number(val), z.number().min(0).max(100).optional()),
});

export {
    createQuizSchema
};
