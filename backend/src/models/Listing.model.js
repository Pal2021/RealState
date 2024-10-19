import { request } from "express";
import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    bedroom: {
      type: Number,
      required: true,
    },
    livingRoom: {
      type: Number,
      required: true,
    },
    bathroom: {
      type: Number,
      required: true,
    },
    parking: {
      type: Number,
      required: true,
    },
    isSold: {
      type: Boolean,
      default: true,
      required: true,
    },
    cardPhoto: {
      type: String,
      required: true,
    },
    ListName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Listing = mongoose.model("Listing", listingSchema);
