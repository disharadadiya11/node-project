const express = require('express');
const { checkRoleMiddleware } = require('../middleware/auth/auth.middleware');
const { validateSchema } = require('../middleware/validate.middleware');
const { createSubjectJoiValidation, updateSubjectJoiValidation } = require('../validation/subject/subject.validation');
const { CreateSubject, UpdateSubject, DeleteSubject, GetSubject, GetAllSubject } = require('../controller/subject/subject.controller');
const router = express.Router();

//create subject
router.post('/create', checkRoleMiddleware(['admin', 'staff']), validateSchema(createSubjectJoiValidation, "body"), CreateSubject.controller);

//update subject
router.put('/update/:id', checkRoleMiddleware(['admin', 'staff']), validateSchema(updateSubjectJoiValidation, "body"), UpdateSubject.controller);

//delete subject
router.delete('/delete', checkRoleMiddleware(['admin']), DeleteSubject.controller);

//delete subject
router.get('/get/:id', checkRoleMiddleware(['admin', 'staff']), GetSubject.controller);

//delete subject
router.get('/getall', checkRoleMiddleware(['admin', 'staff', 'student']), GetAllSubject.controller);
module.exports = router;