import { Client as S3Client } from 'minio'


const endPoint = process.env.NITRO_S3_URL;
const accessKey = process.env.NITRO_S3_ACCESSKEY;
const secretKey = process.env.NITRO_S3_SECRET;

if (typeof endPoint !== 'string' || typeof accessKey !== 'string' || typeof secretKey !== 'string') {
  throw new Error('S3 credentials not set');
}

export const s3client = new S3Client({
  endPoint,
  accessKey,
  secretKey
});