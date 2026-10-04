import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import config from '../config/config.js';
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


/* S3 instance created */
const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  }
})

/* Upload files function */
export const uploadFile = async (file) => {
  const key = `${uuidv4()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: "spotify-auth",
    Body: file.buffer,
    Key: key,
  })
  const response = await s3.send(command);
  return key;
}


/* Urls of files function */
export const getPresignedUrls = async (key) => {
  const command = new GetObjectCommand({
    Bucket: "spotify-auth",
    Key: key
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }) // 1 hour

  return url
}
