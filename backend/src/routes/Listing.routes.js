import { Router } from "express";
import {
  createListing,
  getAlllist,
  RemoveListItem,
  SoldList,
  getListingById,
  updateListingStatus,
  updateListing,
} from "../controllers/listing.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { removePhotoMiddleware } from "../middlewares/removePhoto.middleware.js";

const router = Router();

router.route("/listing").post(upload.array("photos", 8), createListing);

router.route("/all-listings").get(getAlllist);

router
  .route("/remove-listing/:id")
  .delete(removePhotoMiddleware, RemoveListItem);

router.route("/sold-listings").get(SoldList);

router.route("/listing/:id").get(getListingById);

router.put("/update-listing-status/:id", updateListingStatus);

router
  .route("/update-listing/:id")
  .put(upload.array("photos", 8), updateListing);

export default router;
