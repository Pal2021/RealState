import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("File uploaded to Cloudinary:", response.url);

    await new Promise((resolve) => setTimeout(resolve, 100));

    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", localFilePath, err);
      } else {
        console.log("Successfully deleted local file:", localFilePath);
      }
    });

    return response;
  } catch (error) {
    //console.error("Error uploading to Cloudinary:", error);
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error(
          "Failed to delete local file after error:",
          localFilePath,
          err
        );
      }
    });
    return null;
  }
};

export { uploadOnCloudinary };
