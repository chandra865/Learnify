import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate a pre-signed S3 upload URL
 * @param {Object} params
 * @param {string} params.bucket - S3 bucket name
 * @param {string} params.key - S3 object key (path + filename)
 * @param {string} params.contentType - MIME type (e.g., video/mp4)
 * @returns {Promise<string>} - Signed URL
 */
export const generateUploadUrl = async ({ bucket, key, contentType }) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
};

export const deleteFolderFromS3 = async ({ bucket, prefix }) => {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });

    const listedObjects = await s3.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log("No files found to delete.");
      return;
    }

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
      },
    });

    await s3.send(deleteCommand);
    console.log(`Deleted all files under: ${prefix}`);
  } catch (error) {
    console.error("Error deleting S3 folder:", error);
    throw error;
  }
};
