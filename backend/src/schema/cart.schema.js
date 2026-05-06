import {z} from "zod";

const addCartSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    price: z.preprocess((val) => Number(val), z.number().min(0)),
});

export {
    addCartSchema
};
