import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "info_tics",
  });
}

export async function uploadDocument(filePath, extension) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "info_tics",
    resource_type: "auto",
    format: extension,
  });
}

export async function deleteImage(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}