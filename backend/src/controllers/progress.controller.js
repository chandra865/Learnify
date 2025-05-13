import { Progress } from "../models/progress.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import PDFDocument from 'pdfkit';

const updateProgress = asyncHandler(async (req, res) => {
  const { userId, courseId, lectureId, watchTime, totalDuration, totalLectures } = req.body;

  let progress = await Progress.findOneAndUpdate(
    { userId, courseId },
    {
      ...(watchTime / totalDuration >= 0.9
        ? { $addToSet: { completedLectures: lectureId } }
        : {}), // Only add lecture if it's completed
    },
    { new: true, upsert: true }
  );

  // Recalculate progress percentage
  progress.progressPercentage =
    (progress.completedLectures.length / totalLectures) * 100;

  // Mark course as completed if progress reaches 100%
  if (progress.progressPercentage === 100 && !progress.courseCompleted) {
    progress.courseCompleted = true;
  }

  await progress.save();

  return res.status(200).json(
    new ApiResponse(200, progress, "Progress Updated Successfully")
  );
});


const unmarkLectureComplete = asyncHandler(async (req, res) => {
  const { userId, courseId, lectureId, totalLectures } = req.body;

  let progress = await Progress.findOneAndUpdate(
    { userId, courseId },
    { $pull: { completedLectures: lectureId } },
    { new: true }
  );

  if (!progress) {
    return res.status(404).json(
      new ApiResponse(404, null, "Progress record not found")
    );
  }

  // Recalculate progress
  progress.progressPercentage =
    (progress.completedLectures.length / totalLectures) * 100;

  // Reset courseCompleted if progress drops below 100
  if (progress.courseCompleted && progress.progressPercentage < 100) {
    progress.courseCompleted = false;
  }

  await progress.save();

  return res.status(200).json(
    new ApiResponse(200, progress, "Lecture unmarked as complete")
  );
});


const markLectureComplete = asyncHandler(async (req, res) => {
  const { userId, courseId, lectureId, totalLectures } = req.body;

  let progress = await Progress.findOneAndUpdate(
    { userId, courseId },
    { $addToSet: { completedLectures: lectureId } },
    { new: true, upsert: true }
  );

  // Update progress percentage
  progress.progressPercentage =
    (progress.completedLectures.length / totalLectures) * 100;

  // Mark course as completed if progress reaches 100%
  if (progress.progressPercentage === 100 && !progress.courseCompleted) {
    progress.courseCompleted = true;
  }

  await progress.save();

  return res.status(200).json(
    new ApiResponse(200, progress, "Lecture marked as complete")
  );
});


const getProgress = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;

  const progress = await Progress.findOne({ userId, courseId });

  if (!progress) {
    throw new ApiError(400, "progress not found");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, progress, "progress fetched successfully"));
});


const getCertificate = async (req, res) => {
  console.log("Generating certificate...");
  const { userId, courseId } = req.params;

  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!user) throw new ApiError(404, "User not found");
  if (!course) throw new ApiError(404, "Course not found");

  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 30 });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${user.name}_${course.title}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // Certificate Border
  doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20).stroke();

  // Title
  doc
    .fontSize(30)
    .font("Helvetica-Bold")
    .text("Certificate of Completion", { align: "center" })
    .moveDown(1.5);

  // Subtitle
  doc.fontSize(14).font("Helvetica").text("This is to certify that", {
    align: "center",
  }).moveDown(1.5);

  // Student Name
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(user.name, { align: "center", underline: true })
    .moveDown(1.5);

  // Completion Statement
  doc.fontSize(14).text("has successfully completed the course", {
    align: "center",
  }).moveDown(1.5);

  // Course Title
  doc.fontSize(18).fillColor("#C70039").text(course.title, { align: "center" }).moveDown(1.5);

  // Completion Date
  doc
    .moveDown(1)
    .fillColor("black")
    .fontSize(12)
    .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" }).moveDown(1.5);

  doc.end();
};


export { updateProgress, getProgress, getCertificate, unmarkLectureComplete, markLectureComplete};
