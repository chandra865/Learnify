import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs/promises";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegStatic);

export const getVideoDuration = async (videoFile) => {
  if (!videoFile || !videoFile.tempFilePath) {
    throw new Error("Invalid video file");
  }

  const tempPath = path.join("uploads", `temp_${Date.now()}.mp4`);

  try {
    // Ensure uploads directory exists
    await fs.mkdir("uploads", { recursive: true });

    // Move the uploaded file
    await fs.rename(videoFile.tempFilePath, tempPath);

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(tempPath, async (err, metadata) => {
        await fs.unlink(tempPath).catch(() => {}); // Cleanup file

        if (err || !metadata?.format?.duration) {
          return reject("Failed to extract duration");
        }
        resolve(metadata.format.duration); // Return duration in seconds
      });
    });

  } catch (error) {
    throw new Error(`Error processing video: ${error.message}`);
  }
};
