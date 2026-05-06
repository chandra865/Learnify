import {z} from "zod";

const addReviewSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"),
    rating: z.preprocess((val) => Number(val), z.number().min(1).max(5)),
    comment: z.string().min(1, "Comment is required"),
});

export {
    addReviewSchema
};
