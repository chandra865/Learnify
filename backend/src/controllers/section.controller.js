import { Section } from "../models/section.model.js";
import { Course } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createSection = asyncHandler(async (req, res) => {
  const { title, courseId } = req.body;

  if (!title || !courseId) {
    throw new ApiError(400, "Title and courseId are required");
  }

  // Get current count of sections in the course
  const sectionCount = await Section.countDocuments({ courseId });

  const section = await Section.create({
    title,
    courseId,
    order: sectionCount + 1,
  });

  await Course.findByIdAndUpdate(courseId, {
    $push: { sections: section._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, section, "Section created successfully"));
});

const getSectionsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const sections = await Section.find({ courseId }).populate("lectures");

  return res
    .status(200)
    .json(new ApiResponse(200, sections, "Sections fetched successfully"));
});

const deleteSection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;

  const section = await Section.findById(sectionId);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  const courseId = section.courseId;
  const deletedOrder = section.order;

  //   // Delete all lectures inside this section
  //   await Lecture.deleteMany({ section: sectionId });
  //find lecture length

  const lectureLength = section.lectures.length;

  if(lectureLength > 0){
    return res
    .status(200)
    .json(new ApiResponse(200, null, "section should be empty"))
  }

  // Finally, delete the section itself
  await section.deleteOne();

  //Decrement order of sections with higher order in the same course
  await Section.updateMany(
    {
      courseId,
      order: { $gt: deletedOrder },
    },
    {
      $inc: { order: -1 },
    }
  );

  
  // Remove section from its course
  await Course.findByIdAndUpdate(section.courseId, {
    $pull: { sections: sectionId },
  });

  

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Section and its lectures deleted"));
});

const updateSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;
    const { title } = req.body;
  
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { title },
      { new: true }
    );
  
    if (!section) {
        throw new ApiError(404,'Section not found');
    }
    
    res
    .status(200)
    .json(new ApiResponse(200,section,"section updated successfully"));
});
  
export { createSection, getSectionsByCourse, deleteSection, updateSection };
