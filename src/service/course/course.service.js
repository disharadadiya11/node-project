const httpStatus = require("http-status");
const { Course } = require("../../model/course/course.model");
const { MSG } = require("../../helper/constant");
const { ErrorExceptionWithResponse } = require("../../exception/error.exception");
const { successResponse } = require("../../utils/common.utils");
const mongoose = require("mongoose");

module.exports = class CourseService {
      constructor() {
            this.courseModel = Course;
      }

      //-----------------------------------------------[ Create Course ]-------------------------------------------------
      async createCourse(user, Body, files) {
            try {
                  // If images are uploaded
                  if (files && files.length > 0) {
                        Body.images = files.map((file) => {
                              return `http://${process.env.IP}:${process.env.PORT}/${file.path}`;
                        });
                  }

                  Body.createdAt = await new Date();
                  Body.createdBy = await user._id;
                  let course = await this.courseModel.create(Body);
                  return successResponse(httpStatus.OK, false, MSG.CREATE_SUCCESS, course);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || httpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }

      //-----------------------------------------------[ Update Course ]-------------------------------------------------
      async updateCourse(user, params, Body, files) {
            try {
                  // If images are uploaded
                  if (files && files.length > 0) {
                        Body.images = files.map((file) => {
                              return `http://${process.env.IP}:${process.env.PORT}/${file.path}`;
                        });
                  }

                  Body.updatedAt = await new Date();
                  Body.updatedBy = await user._id;
                  let course = await this.courseModel.findByIdAndUpdate(params.id, Body, { new: true });
                  if (!course)
                        throw new ErrorExceptionWithResponse(httpStatus.BAD_REQUEST, true, MSG.COURSE_NOT_FOUND);
                  return successResponse(httpStatus.OK, false, MSG.UPDATE_SUCCESS, course);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || httpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }

      //-----------------------------------------------[ Delete Course ]-------------------------------------------------
      async deleteCourse(user, Body) {
            try {
                  let course = await this.courseModel.updateMany({ _id: { $in: Body.ids } }, { $set: { isAvailable: false } });
                  if (!course)
                        throw new ErrorExceptionWithResponse(httpStatus.BAD_REQUEST, true, MSG.COURSE_NOT_FOUND);
                  return successResponse(httpStatus.OK, false, MSG.DELETE_SUCCESS);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || httpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }

      //-----------------------------------------------[ Get Course ]-------------------------------------------------
      async getCourse(params, user) {
            try {
                  let course = await this.courseModel.findById(params.id);
                  if (!course)
                        throw new ErrorExceptionWithResponse(httpStatus.BAD_REQUEST, true, MSG.COURSE_NOT_FOUND);
                  return successResponse(httpStatus.OK, false, MSG.FOUND_SUCCESS, course);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || httpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }

      //-----------------------------------------------[ Get All Course ]-------------------------------------------------
      async getAllCourse(user, Query) {
            try {

                  let price = Query && 'startPrice' in Query && Query.startPrice.trim() !== '' && 'endPrice' in Query && Query.endPrice.trim() !== '' ?
                        [{
                              $match: {
                                    price: {
                                          $gte: Number(Query.startPrice),
                                          $lte: Number(Query.endPrice),
                                    }
                              }
                        }] : [];

                  const pipeline = [{
                        $match: { $and: [{ createdBy: new mongoose.Types.ObjectId(user._id) }] },
                  }];

                  let course = await this.courseModel.aggregate(pipeline);
                  return successResponse(httpStatus.OK, false, MSG.FOUND_SUCCESS, course);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || httpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }
};