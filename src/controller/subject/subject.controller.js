const SubjectService = require("../../service/subject/subject.service");
const service = new SubjectService();

//-----------------------------------------------[ Create Subject ]-------------------------------------------------
module.exports.CreateSubject = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.createSubject(req.user, req.body);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Update Subject ]-------------------------------------------------
module.exports.UpdateSubject = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.updateSubject(req.user, req.params, req.body);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Delete Subject ]-------------------------------------------------
module.exports.DeleteSubject = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.deleteSubject(req.user, req.body);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Get Subject ]-------------------------------------------------
module.exports.GetSubject = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.getSubject(req.params);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Get All Subject ]-------------------------------------------------
module.exports.GetAllSubject = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.getAllSubject(req.user, req.query);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};