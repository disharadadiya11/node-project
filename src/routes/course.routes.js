const express = require("express");
const { validateSchema } = require("../middleware/validate.middleware");
const {
  createCourseJoiValidation,
  updateCourseJoiValidation,
} = require("../validation/course/course.validation");
const {
  CreateCourse,
  UpdateCourse,
  DeleteCourse,
  GetCourse,
  GetAllCourse,
  UploadCourseCsv,
} = require("../controller/course/course.controller");
const MulterService = require("../service/common/multer.service");
const { checkRoleMiddleware } = require("../middleware/auth/auth.middleware");
const multerService = new MulterService();
const router = express.Router();

//create course
router.post(
  "/create",
  checkRoleMiddleware(["admin", "staff"]),
  multerService.multipleImageUpload("images", 3),
  validateSchema(createCourseJoiValidation, "body"),
  CreateCourse.controller
);

//update course
router.put(
  "/update/:id",
  checkRoleMiddleware(["admin", "staff"]),
  multerService.multipleImageUpload("images", 3),
  validateSchema(updateCourseJoiValidation, "body"),
  UpdateCourse.controller
);

//delete course
router.delete(
  "/delete",
  checkRoleMiddleware(["admin"]),
  DeleteCourse.controller
);

//get course
router.get(
  "/get/:id",
  checkRoleMiddleware(["admin", "staff", "student"]),
  GetCourse.controller
);

//get all course
router.get(
  "/getall",
  checkRoleMiddleware(["admin", "staff", "student"]),
  GetAllCourse.controller
);

//create course
router.post(
  "/upload",
  multerService.singleImageOrFileUpload("file"),
  checkRoleMiddleware(["admin", "staff"]),
  UploadCourseCsv.controller
);

module.exports = router;
