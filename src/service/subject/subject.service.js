const httpStatus = require("http-status");
const { Subject } = require("../../model/subject/subject.model");
const { successResponse } = require("../../utils/common.utils");
const { MSG } = require("../../helper/constant");
const { ErrorExceptionWithResponse } = require("../../exception/error.exception");
const mongoose = require("mongoose");

module.exports = class SubjectService {
      constructor() {
            this.subjectModel = Subject;
      }

      //-----------------------------------------------[ Create Subject ]-------------------------------------------------
      async createSubject(user, Body) {
            try {
                  Body.createdBy = await user._id;
                  Body.createdAt = await new Date();
                  let subject = await this.subjectModel.create(Body);

                  return successResponse(httpStatus.OK, false, MSG.CREATE_SUCCESS, subject);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(error.status || httpStatus.BAD_REQUEST, true, error.message || MSG.INTERNAL_SERVER_ERROR)
            }
      }

      //-----------------------------------------------[ Update Subject ]-------------------------------------------------
      async updateSubject(user, params, Body) {
            try {
                  Body.updatedBy = await user._id;
                  Body.updatedAt = await new Date();
                  let subject = await this.subjectModel.findByIdAndUpdate(params.id, Body, { new: true });
                  if (!subject)
                        throw new ErrorExceptionWithResponse(httpStatus.BAD_REQUEST, true, MSG.SUBJECT_NOT_FOUND);

                  return successResponse(httpStatus.OK, false, MSG.UPDATE_SUCCESS, subject);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(error.status || httpStatus.BAD_REQUEST, true, error.message || MSG.INTERNAL_SERVER_ERROR)
            }
      }

      //-----------------------------------------------[ Delete Subject ]-------------------------------------------------
      async deleteSubject(user, Body) {
            try {
                  let subject = await this.subjectModel.updateMany({ _id: { $in: Body.ids } }, { $set: { isAvailable: false } });
                  if (!subject)
                        throw new ErrorExceptionWithResponse(httpStatus.BAD_REQUEST, true, MSG.SUBJECT_NOT_FOUND);

                  return successResponse(httpStatus.OK, false, MSG.DELETE_SUCCESS);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(error.status || httpStatus.BAD_REQUEST, true, error.message || MSG.INTERNAL_SERVER_ERROR)
            }
      }

      //-----------------------------------------------[ Get Subject ]-------------------------------------------------
      async getSubject(params) {
            try {
                  let subject = await this.subjectModel.findById(params.id);
                  if (!subject)
                        throw new ErrorExceptionWithResponse(httpStatus.BAD_REQUEST, true, MSG.SUBJECT_NOT_FOUND);

                  return successResponse(httpStatus.OK, false, MSG.FOUND_SUCCESS, subject);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(error.status || httpStatus.BAD_REQUEST, true, error.message || MSG.INTERNAL_SERVER_ERROR)
            }
      }

      //-----------------------------------------------[ Get All Subject ]-------------------------------------------------
      async getAllSubject(user, Query) {
            try {

                  let search = Query && 'search' in Query ?
                        [{
                              $match: {
                                    $or: [
                                          { "createdBy.name": { $regex: new RegExp(Query.search, "i") } },
                                          { "createdBy.email": { $regex: new RegExp(Query.search, "i") } },
                                          { "name": { $regex: new RegExp(Query.search, "i") } }
                                    ]
                              }
                        }] : [];


                  const specificUserMatch = Query && 'user' in Query ? [{ $match: { createdBy: new mongoose.Types.ObjectId(Query.user) } }] : [];

                  const pipeline = [
                        ...specificUserMatch,
                        {
                              $lookup: {
                                    from: "users", // it is database collection name
                                    localField: "createdBy",
                                    foreignField: "_id",
                                    as: "createdBy", // Will always be an array
                                    pipeline: [
                                          {
                                                $project: {
                                                      _id: 1,
                                                      name: 1,
                                                      email: 1
                                                }

                                          }
                                    ]
                              },
                        },
                        {
                              $set: {
                                    createdBy: { $first: "$createdBy" } // Get the first (and only) element of the array , here "$createdBy" is as field name.
                              }
                        },
                        ...search
                  ];

                  let subject = await this.subjectModel.aggregate(pipeline);
                  return successResponse(httpStatus.OK, false, MSG.FOUND_SUCCESS, subject);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(error.status || httpStatus.BAD_REQUEST, true, error.message || MSG.INTERNAL_SERVER_ERROR)
            }
      }
};