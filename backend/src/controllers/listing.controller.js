import { asyncHandler } from "../utils/asyncHandler.js";
import { Listing } from "../models/Listing.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ListingDetail } from "../models/ListingDetail.model.js";
import { deleteFromCloudinary } from "../middlewares/removePhoto.middleware.js";

const createListing = asyncHandler(async (req, res) => {
  const {
    ListName,
    address,
    bedroom,
    livingRoom,
    bathroom,
    parking,
    isSold,
    description,
    location,
    price,
  } = req.body;
  if (
    [address, bedroom, livingRoom, bathroom, parking, isSold, ListName].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (
    [description, location, price].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required for ListingDetail");
  }
  const photos = req.files;
  if (!photos || photos.length === 0) {
    throw new ApiError(400, "At least one photo is required");
  }

  if (photos.length > 8) {
    throw new ApiError(400, "You can upload a maximum of 8 photos");
  }

  const uploadedPhotos = await Promise.all(
    photos.map(async (photo) => {
      const photoPath = photo.path;
      const uploadedPhoto = await uploadOnCloudinary(photoPath);
      return uploadedPhoto.url;
    })
  );

  if (!uploadedPhotos || uploadedPhotos.length === 0) {
    throw new ApiError(500, "Failed to upload photos to Cloudinary");
  }

  const listing = await Listing.create({
    address,
    bedroom,
    livingRoom,
    bathroom,
    parking,
    isSold,
    cardPhoto: uploadedPhotos[0],
    ListName,
  });

  const listingDetail = await ListingDetail.create({
    listingId: listing._id,
    description,
    photos: uploadedPhotos,
    location,
    price,
  });

  const createdListing = await Listing.findById(listing._id).select("-__v");
  const createdListingDetail = await ListingDetail.findById(
    listingDetail._id
  ).select("-__v");

  if (!createdListing || !createdListingDetail) {
    throw new ApiError(
      500,
      "Something went wrong while creating the listing and details"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { listing: createdListing, details: createdListingDetail },
        "Listing and details created successfully"
      )
    );
});

const getAlllist = asyncHandler(async (req, res) => {
  try {
    const Listingdata = await Listing.find({});
    const detailsdata = await ListingDetail.find({});
    //console.log("Fetched listings:", Listingdata, detailsdata);
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          Listingdata,
          detailsdata,
          "Listing data and detailsdata fetched successfully"
        )
      );
  } catch (error) {
    //console.error("Failed to fetch listings:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch list"));
  }
});

const RemoveListItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Listing ID is required");
  }

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    throw new ApiError(404, "Listing not found");
  }

  const deletedListingDetail = await ListingDetail.findOneAndDelete({
    listingId: id,
  });

  if (!deletedListingDetail) {
    throw new ApiError(404, "Listing details not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedListing, deletedListingDetail },
        "Listing and details removed successfully"
      )
    );
});

const SoldList = asyncHandler(async (req, res) => {
  try {
    const data = await Listing.find({ isSold: true });
    return res
      .status(201)
      .json(new ApiResponse(200, data, "List fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch list"));
  }
});

const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Listing ID is required");
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "Listing fetched successfully"));
});

const updateListingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isSold } = req.body;

  if (!id) {
    throw new ApiError(400, "Listing ID is required");
  }
  if (isSold === undefined || isSold === null) {
    throw new ApiError(400, "isSold field is required");
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { isSold },
    { new: true }
  );

  if (!updatedListing) {
    throw new ApiError(404, "Listing not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedListing,
        "Listing status updated successfully"
      )
    );
});

const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    ListName,
    address,
    bedroom,
    livingRoom,
    bathroom,
    parking,
    isSold,
    description,
    location,
    price,
  } = req.body;

  if (
    [address, bedroom, livingRoom, bathroom, parking, isSold, ListName].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (
    [description, location, price].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required for ListingDetail");
  }

  const existingListingDetail = await ListingDetail.findOne({ listingId: id });
  if (!existingListingDetail) {
    throw new ApiError(404, "Listing details not found");
  }

  const photos = req.files;
  let uploadedPhotos = [];
  let allPhotos = existingListingDetail.photos;

  if (photos && photos.length > 0) {
    uploadedPhotos = await Promise.all(
      photos.map(async (photo) => {
        const photoPath = photo.path;
        const uploadedPhoto = await uploadOnCloudinary(photoPath);
        return uploadedPhoto.url;
      })
    );

    if (!uploadedPhotos || uploadedPhotos.length === 0) {
      throw new ApiError(500, "Failed to upload photos to Cloudinary");
    }

    await Promise.all(
      existingListingDetail.photos.map(async (photoUrl) => {
        await deleteFromCloudinary(photoUrl);
      })
    );

    allPhotos = uploadedPhotos;
  }

  if (allPhotos.length > 8) {
    throw new ApiError(400, "You can only upload up to 8 photos.");
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    {
      address,
      bedroom,
      livingRoom,
      bathroom,
      parking,
      isSold,
      cardPhoto: allPhotos[0],
      ListName,
    },
    { new: true }
  );

  if (!updatedListing) {
    throw new ApiError(404, "Listing not found");
  }

  const updatedListingDetail = await ListingDetail.findOneAndUpdate(
    { listingId: id },
    {
      description,
      photos: allPhotos,
      location,
      price,
    },
    { new: true }
  );

  if (!updatedListingDetail) {
    throw new ApiError(404, "Listing details not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { listing: updatedListing, details: updatedListingDetail },
        "Listing and details updated successfully"
      )
    );
});

export {
  createListing,
  getAlllist,
  RemoveListItem,
  SoldList,
  getListingById,
  updateListingStatus,
  updateListing,
};
