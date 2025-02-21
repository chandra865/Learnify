import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCourse = asyncHandler(async (req, res) =>{
    const {title, description, category, price} = req.body;

    if(!title || !description || !category || !price){
        throw new ApiError(400, "All field are required");
    }
    //instuctor id
    const instructor = req.user._id;
    const course = await Course.create({
        title,
        description,
        category,
        price,
        instructor,
    })

    const createdCourse = await Course.find(course._id);

    if(!createdCourse){
        throw new ApiError(500, "something went wrong while creating course");
    }

    //pushing info about that, this instructor create this course
    const user = await User.findById(req.user._id);
    user.createdCourses.push(course._id);
    await user.save();
   
    return res
    .status(201)
    .json(new ApiResponse(200, createdCourse, "Course Created Successfully"));
})

const addLecture = asyncHandler(async (req, res) =>{

    const {courseId} = req.params;
    
    const {title, videoUrl, content, duration } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Create new lecture
    const newLecture = await Lecture.create({ course: courseId, title, videoUrl, content, duration });

    // Add lecture to course
    course.lecture.push(newLecture._id);
    await course.save();

    return res
    .status(201)
    .json(new ApiResponse(200, {course, newLecture}, "Lecture added successfully"));

})


const instructorCourses = asyncHandler(async (req, res)=>{

    const user = await User.findById(req.user._id);
    if(!user)  throw new ApiError(404, "user not found");
    const myCourses = user.createdCourses;
    return res
    .status(201)
    .json(new ApiResponse(200, myCourses, "Courses fetched successfully"));

})

const courseEnrollment = asyncHandler(async (req, res)=>{

    const {courseId} = req.params;

    const course = await Course.findById(courseId);
    if(!course)  throw new ApiError(404, "course not found");
    course.enrolledStudents.push(req.user._id);
    await course.save();


    const user = await User.findById(req.user._id);
    if(!user)  throw new ApiError(404, "user not found");
    user.enrolledCourses.push(courseId);
    await user.save();

    return res
    .status(201)
    .json(new ApiResponse(200, course, "Course enrollment successfully"));
    
})


const stuCourses = asyncHandler(async(req, res)=>{

    const user = await User.findById(req.user._id);
    if(!user)  throw new ApiError(404, "user not found");
    const myCourses = user.enrolledCourses;
    return res
    .status(201)
    .json(new ApiResponse(200, myCourses, "Courses fetched successfully"));
})

export {createCourse, addLecture, instructorCourses, courseEnrollment, stuCourses};