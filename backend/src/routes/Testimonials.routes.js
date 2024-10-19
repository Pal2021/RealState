import { Router } from "express";
import {
  AddTestimonials,
  deleteTestimonials,
  getAllTestimonials,
  updateTestimonial,
} from "../controllers/AllTestimonials.controller.js";

const router = Router();

router.route("/Add-Testimonials").post(AddTestimonials);
router.route("/delete-Testimonial/:id").delete(deleteTestimonials);
router.route("/getAllTestimonial").get(getAllTestimonials);
router.route("/update-testimonial/:id").put(updateTestimonial);

export default router;
