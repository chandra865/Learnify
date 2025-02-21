import mongoose, {Schema} from "mongoose";

const lectureSchema = new Schema({

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

export const Lecture = mongoose.model('Lecture', lectureSchema);