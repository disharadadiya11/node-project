const express = require('express');
const router = express.Router();

//user routes     
router.use('/user', require('./user.routes'));

//course routes
router.use('/course', require('./course.routes'));

//subject routes
router.use('/subject', require('./subject.routes'));

module.exports = router;

