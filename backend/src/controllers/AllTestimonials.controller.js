import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { TestimonialSchema } from "../models/Testimonials.model.js";

const AddTestimonials = asyncHandler(async (req, res) => {
  const { user, comment } = req.body;

  if ([user, comment].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const newTestimonial = await TestimonialSchema.create({
    user,
    comment,
  });

  const createdTestimonial = await TestimonialSchema.findById(
    newTestimonial._id
  ).select("-__v");

  if (!createdTestimonial) {
    throw new ApiError(
      500,
      "Something went wrong while creating the Testimonial"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdTestimonial,
        "Testimonial created successfully"
      )
    );
});

const deleteTestimonials = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Testimonial ID is required");
  }

  const deletedTestimonial = await TestimonialSchema.findByIdAndDelete(id);

  if (!deletedTestimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedTestimonial,
        "Testimonial removed successfully"
      )
    );
});

const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await TestimonialSchema.find().select("-__v");
  return res
    .status(200)
    .json(
      new ApiResponse(200, testimonials, "Testimonials fetched successfully")
    );
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user, comment } = req.body;

  if (!user || !comment) {
    throw new ApiError(400, "All fields are required");
  }

  const updatedTestimonial = await TestimonialSchema.findByIdAndUpdate(
    id,
    { user, comment },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!updatedTestimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTestimonial,
        "Testimonial updated successfully"
      )
    );
});

export {
  AddTestimonials,
  deleteTestimonials,
  getAllTestimonials,
  updateTestimonial,
};
