import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const clearFile = (filePath) => {
  const __dirname = path.resolve();
  filePath = path.join(__dirname, filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
};

const uploadImage = async (file, next) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: "music-app-expressjs/images",
    });
    if (result) {
      clearFile(file.path);
    }
    return result.secure_url;
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (public_id, next) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    return next(error);
  }
};

const uploadAudio = async (file, next) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: "music-app-expressjs/audios",
      resource_type: "auto",
    });
    if (result) {
      clearFile(file.path);
    }
    return {
      songURL: result.secure_url,
      duration: result.duration,
    };
  } catch (error) {
    return next(error);
  }
};

const deleteAudio = async (public_id, next) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    return next(error);
  }
};

const uploadHelper = {
  uploadImage,
  deleteImage,
  uploadAudio,
  deleteAudio,
};

export default uploadHelper;
