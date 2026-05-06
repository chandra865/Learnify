import {z} from "zod";

const uploadMediaSchema = z.object({
    mediaType: z.enum(["thumbnail", "video", "profilepic"]),
});

export {
    uploadMediaSchema
};
