const CourseService = require("../../service/course/course.service");
const service = new CourseService();

//-----------------------------------------------[ Create Course ]-------------------------------------------------
module.exports.CreateCourse = {
  controller: async (req, res, next) => {
    try {
      const result = await service.createCourse(req.user, req.body, req.files);
      return res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  },
};

//-----------------------------------------------[ Update Course ]-------------------------------------------------
module.exports.UpdateCourse = {
  controller: async (req, res, next) => {
    try {
      const result = await service.updateCourse(
        req.user,
        req.params,
        req.body,
        req.files
      );
      return res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  },
};

//-----------------------------------------------[ Delete Course ]-------------------------------------------------
module.exports.DeleteCourse = {
  controller: async (req, res, next) => {
    try {
      const result = await service.deleteCourse(req.user, req.body);
      return res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  },
};

//-----------------------------------------------[ Get Course ]-------------------------------------------------
module.exports.GetCourse = {
  controller: async (req, res, next) => {
    try {
      const result = await service.getCourse(req.params, req.user);
      return res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  },
};

//-----------------------------------------------[ Get All Course ]-------------------------------------------------
module.exports.GetAllCourse = {
  controller: async (req, res, next) => {
    try {
      const result = await service.getAllCourse(req.user, req.body);
      return res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  },
};

//------------------------------------------[ Upload  Course Csv File ]----------------------------------------------
module.exports.UploadCourseCsv = {
  controller: async (req, res, next) => {
    try {
      if (!req.file || Object.keys(req.file).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const result = await service.UploadCourseCsv(req.user, req.file);
      return res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  },
};
