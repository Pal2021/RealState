import { Listing } from "../models/Listing.model.js";
import { ListingDetail } from "../models/ListingDetail.model.js";
import { ApiError } from "../utils/ApiError.js";
import { v2 as cloudinary } from "cloudinary";

const extractPublicId = (url) => {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  const [publicId] = lastPart.split(".");
  return publicId;
};

const removePhotoMiddleware = async (req, res, next) => {
  const id = req.params.id;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ApiError(404, "Listing not found"));
    }

    const listingDetail = await ListingDetail.findOne({ listingId: id });
    if (!listingDetail) {
      return next(new ApiError(404, "Listing detail not found"));
    }

    const photoUrls = [listing.cardPhoto, ...listingDetail.photos];

    const publicIds = [...new Set(photoUrls.map(extractPublicId))];
    //console.log("Extracted public IDs:", publicIds);

    try {
      const deletionResults = await Promise.all(
        publicIds.map((publicId) => {
          console.log(`Attempting to delete photo with public ID: ${publicId}`);
          return cloudinary.uploader.destroy(publicId).then(
            (result) => ({ publicId, result }),
            (error) => ({ publicId, error })
          );
        })
      );
      //console.log("Deletion results:", deletionResults);

      const failedDeletions = deletionResults.filter(
        (result) =>
          result.result &&
          result.result.result !== "ok" &&
          result.result.result !== "not found"
      );
      if (failedDeletions.length > 0) {
        // console.error("Failed deletions:", failedDeletions);
        return next(
          new ApiError(500, "Failed to remove some photos from Cloudinary")
        );
      }

      const deletionErrors = deletionResults.filter((result) => result.error);
      if (deletionErrors.length > 0) {
        console.error("Deletion errors:", deletionErrors);
        return next(
          new ApiError(
            500,
            "Errors occurred during photo deletion from Cloudinary"
          )
        );
      }
    } catch (error) {
      //console.error("Cloudinary deletion error:", error);
      return next(new ApiError(500, "Failed to remove photos from Cloudinary"));
    }

    req.listing = listing;
    req.listingDetail = listingDetail;
    next();
  } catch (error) {
    // console.error("Error in removePhotoMiddleware:", error);
    next(new ApiError(500, "Server error"));
  }
};
const deleteFromCloudinary = async (photoUrl) => {
  try {
    const publicId = photoUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error("Failed to delete photo from Cloudinary");
  }
};
export { removePhotoMiddleware, deleteFromCloudinary };
