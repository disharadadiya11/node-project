const StatusCodes = require("http-status");
const { Subject } = require("../model/subject.model");
const {
  successResponse,
  successResponseWithCount,
} = require("../utils/common.utils");
const { MSG } = require("../helper/constant");
const { ErrorExceptionWithResponse } = require("../exception/error.exception");
const mongoose = require("mongoose");
const { Course } = require("../model/course.model");

module.exports = class SubjectService {
  constructor() {
    this.subjectModel = Subject;
    this.courseModel = Course;
  }

  //-----------------------------------------------[ Create Subject ]-------------------------------------------------
  async createSubject(user, Body) {
    try {
      let deleteSubject;

      // Find all subjects with the same name, case-insensitive
      let subjects =
        (await this.subjectModel.find({
          name: { $regex: Body.name, $options: "i" },
        })) || [];

      // Check if there's a subject with the exact same name (case-insensitive)
      let checkSubject = subjects?.find(
        (subject) => subject?.name?.toLowerCase() === Body?.name?.toLowerCase()
      );

      if (checkSubject) {
        if (!checkSubject.isDeleted) {
          throw new ErrorExceptionWithResponse(
            StatusCodes.BAD_REQUEST,
            true,
            MSG.SUBJECT_WITH_SAME_NAME_ALREADY_EXISTS
          );
        }
        // Reactivate the existing subject
        checkSubject.set({
          ...Body,
          isDeleted: false,
        });
        await checkSubject.save();

        return successResponse(
          StatusCodes.OK,
          false,
          MSG.SUBJECT_REACTIVATED_SUCCESSFULLY,
          checkSubject
        );
      }

      Body.createdBy = await user._id;
      Body.createdAt = new Date();
      subjects = await this.subjectModel.create(Body);
      return successResponse(
        StatusCodes.OK,
        false,
        MSG.CREATE_SUCCESS,
        subjects
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || StatusCodes.BAD_REQUEST,
        true,
        error.message || MSG.INTERNAL_SERVER_ERROR
      );
    }
  }

  //-----------------------------------------------[ Update Subject ]-------------------------------------------------
  async updateSubject(user, params, Body) {
    try {
      let subject = await this.subjectModel.findById(params.id);
      if (!subject)
        throw new ErrorExceptionWithResponse(
          StatusCodes.BAD_REQUEST,
          true,
          MSG.SUBJECT_NOT_FOUND
        );

      subject =
        (await this.subjectModel.find({
          name: { $regex: Body.name, $options: "i" },
          _id: { $ne: params.id },
          isDeleted: false,
        })) || [];
      console.log(subject, "--");
      let checkSubject = subject.find(
        (subject) => subject?.name?.toLowerCase() == Body?.name?.toLowerCase()
      );

      if (checkSubject) {
        throw new ErrorExceptionWithResponse(
          StatusCodes.BAD_REQUEST,
          true,
          MSG.SUBJECT_WITH_SAME_NAME_ALREADY_EXISTS
        );
      }

      Body.updatedBy = await user._id;
      Body.updatedAt = new Date();
      subject = await this.subjectModel.findByIdAndUpdate(params.id, Body, {
        new: true,
      });
      return successResponse(
        StatusCodes.OK,
        false,
        MSG.UPDATE_SUCCESS,
        subject
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || StatusCodes.BAD_REQUEST,
        true,
        error.message || MSG.INTERNAL_SERVER_ERROR
      );
    }
  }

  //-----------------------------------------------[ Delete Subject ]-------------------------------------------------
  async deleteSubject(user, Body) {
    try {
      let subject = await this.subjectModel.find({
        _id: { $in: Body.ids },
        isDeleted: false,
      });

      //check if the subject has been used in any course then don't delete subject
      let checkSubjectUsed = await this.courseModel.find({
        subject: { $in: subject.map((sub) => sub._id) },
        isDeleted: false,
      });

      if (checkSubjectUsed?.length > 0)
        throw new ErrorExceptionWithResponse(
          StatusCodes.BAD_REQUEST,
          true,
          MSG.SUBJECT_USED_IN_COURSE
        );

      await this.subjectModel.updateMany(
        { _id: { $in: subject.map((sub) => sub._id) } },
        { $set: { isDeleted: true } }
      );

      return successResponse(StatusCodes.OK, false, MSG.DELETE_SUCCESS);
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || StatusCodes.BAD_REQUEST,
        true,
        error.message || MSG.INTERNAL_SERVER_ERROR
      );
    }
  }

  //-----------------------------------------------[ Get Subject ]-------------------------------------------------
  async getSubject(params) {
    try {
      let subject = await this.subjectModel.findById(params.id);
      if (!subject)
        throw new ErrorExceptionWithResponse(
          StatusCodes.BAD_REQUEST,
          true,
          MSG.SUBJECT_NOT_FOUND
        );

      return successResponse(StatusCodes.OK, false, MSG.FOUND_SUCCESS, subject);
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || StatusCodes.BAD_REQUEST,
        true,
        error.message || MSG.INTERNAL_SERVER_ERROR
      );
    }
  }

  //-----------------------------------------------[ Get All Subject ]-------------------------------------------------
  async getAllSubject(user, Query) {
    try {
      // Define default pagination values if not provided
      const page = Query.page ? parseInt(Query.page) : 1;
      const limit = Query.limit ? parseInt(Query.limit) : 10;
      const skip = (page - 1) * limit;

      let search =
        Query && "search" in Query
          ? [
              {
                $match: {
                  $or: [
                    {
                      "createdBy.name": {
                        $regex: new RegExp(Query.search, "i"),
                      },
                    },
                    {
                      "createdBy.email": {
                        $regex: new RegExp(Query.search, "i"),
                      },
                    },
                    { name: { $regex: new RegExp(Query.search, "i") } },
                  ],
                },
              },
            ]
          : [];

      const pipeline = [
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(user._id),
            isDeleted: false,
          },
        },
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
                  email: 1,
                },
              },
            ],
          },
        },
        {
          $set: {
            createdBy: { $first: "$createdBy" }, // Get the first (and only) element of the array , here "$createdBy" is as sfield name.
          },
        },
        ...search,
        { $skip: skip },
        { $limit: limit },
      ];
      let subject = await this.subjectModel.aggregate(pipeline);
      return successResponseWithCount(
        StatusCodes.OK,
        false,
        MSG.FOUND_SUCCESS,
        {
          data: subject,
          totalCount: subject.length,
        }
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || StatusCodes.BAD_REQUEST,
        true,
        error.message || MSG.INTERNAL_SERVER_ERROR
      );
    }
  }
};
