import mongoose, { Schema } from "mongoose";

const Schema1 = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TestimonialSchema = mongoose.model("TestimonialSchema", Schema1);
