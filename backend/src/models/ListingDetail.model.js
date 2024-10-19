import mongoose from "mongoose";

const ListingDetailSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const ListingDetail = mongoose.model("ListingDetail", ListingDetailSchema);

export { ListingDetail };
