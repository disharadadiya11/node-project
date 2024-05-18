const multer = require('multer');
const path = require("path");

module.exports = class MulterService {
      constructor() {
            this.storage = multer.diskStorage({
                  destination: "src/uploads",
                  filename: (req, file, cb) => {
                        return cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, " ")}`);
                  },
            });
            this.fileFilter = (req, file, cb) => {
                  // Accept image files with specific extensions
                  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
                  const fileExtension = path.extname(file.originalname).toLowerCase();
                  if (allowedExtensions.includes(fileExtension)) {
                        cb(null, true);
                  } else {
                        cb(new Error('Only JPG, JPEG, and PNG files are allowed'));
                  }
            };
            this.upload = multer({
                  storage: this.storage,
                  fileFilter: this.fileFilter,
                  limits: {
                        fileSize: 1024 * 1024 * 5,
                  },
            });
      }

      //-----------------------------------------------[ Single Image Upload ]----------------------------------------------
      singleImageUpload(fieldname) {
            return this.upload.single(fieldname);
      }

      //-----------------------------------------------[ multiple Image Upload ]----------------------------------------------
      multipleImageUpload(fieldname, numberofimages) {
            return this.upload.array(fieldname, numberofimages);
      }

      //-----------------------------------------------[ multiple fields Image Upload ]----------------------------------------------
      multipleFieldsImageUpload(fieldsArray) {
            return this.upload.fields(fieldsArray);
      }
};