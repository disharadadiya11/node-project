const cloudinary = require("cloudinary").v2;
const { configDotenv } = require("dotenv");
const { deleteFile } = require("../../utils/common.utils");
configDotenv();

module.exports = class CloudnaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDNARY_API_KEY,
      api_secret: process.env.CLOUDNARY_SECRET_KEY,
    });
  }

  //-----------------------------------------------[  Image Upload path ]------------------------------------------------
  async uploadImageWithPath(imageUrl, folder) {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: folder,
      });
      return result;
    } catch (error) {
      throw new Error("Failed to upload image to Cloudinary.");
    } finally {
      await deleteFile(file.path);
    }
  }

  //-----------------------------------------------[  Image Upload buffer ]----------------------------------------------
  async uploadImageWithPath(imageUrl, folder) {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: folder,
      });
      return result;
    } catch (error) {
      throw new Error("Failed to upload image to Cloudinary.");
    }
  }

  //---------------------[  Delete Image from specifc folder in cloudnary using public id ]-----------------------------
  async deleteImageFromFolder(publicId, folder) {
    try {
      const publicIdWithFolder = folder ? `${folder}/${publicId}` : publicId;
      const result = await cloudinary.uploader.destroy(publicIdWithFolder);
      return result;
    } catch (error) {
      throw new Error("Error deleting image from Cloudinary:");
    }
  }
};
