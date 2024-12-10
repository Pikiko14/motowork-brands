import { Router } from "express";
import { upload } from "../utils/storage";
import sessionCheck from "../middlewares/sessions.middleware";
import perMissionMiddleware from "../middlewares/permission.middleware";
import { BrandsController } from "../controllers/brands.controller";
import { BrandsCreationValidator, BrandIdValidator } from "../validators/brands.validator";
import { PaginationValidator } from "../validators/request.validator";

// init router
const router = Router();

// instance controller
const controller = new BrandsController();

/**
 * Create brands
 */
router.post(
  "/",
  sessionCheck,
  perMissionMiddleware("create-brand"),
  upload.single("file"),
  BrandsCreationValidator,
  controller.createBrands
);

/**
 * Get brands
 */
router.get(
  "/",
  sessionCheck,
  perMissionMiddleware("list-brand"),
  PaginationValidator,
  controller.getBrands
);

/**
 * Show brands
 */
router.get(
  "/:id",
  sessionCheck,
  perMissionMiddleware("list-brand"),
  BrandIdValidator,
  controller.showBrand
);

/**
 * Delete brands
 */
router.delete(
  "/:id",
  sessionCheck,
  perMissionMiddleware("delete-brand"),
  BrandIdValidator,
  controller.deleteBrand
);

/**
 * Update brands
 */
router.put(
  "/:id",
  sessionCheck,
  perMissionMiddleware("update-brand"),
  BrandIdValidator,
  upload.single("file"),
  BrandsCreationValidator,
  controller.updateBrands
);

/**
 * Update brands
 */
router.put(
  "/:id/change-status",
  sessionCheck,
  perMissionMiddleware("update-brand"),
  BrandIdValidator,
  controller.changeBrandStatus
);

// export router
export { router };
