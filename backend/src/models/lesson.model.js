import mongoose, {Schema} from "mongoose";

const lessonSchema = new Schema({

    course:{
        type:Schema.Types.ObjectId,
        ref:'Course',
        required: true
    },

    title:{
        type: String,
        required:true
    },

    videoUrl:{
        type:String,
        required:true
    },

    content:{
        type:String
    },

    duration:{
        type:Number
    }
})

export const Lesson = mongoose.model('Lesson', lessonSchema);