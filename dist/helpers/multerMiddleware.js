const multer = require('multer');
// Multer storage to store files buffer in memory
// const multerMemoryStorage = multer.memoryStorage();
const dir = "./public/images";
const multerMemoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
class multerUploadMiddleware {
    /***
     * Return multer object that's use as middleware for supporting upload single file
     * @param fileFieldName {string} File field name in form-data request
     * @return {*} Multer object
     */
    static single(fileFieldName) {
        return multer({
            storage: multerMemoryStorage,
        }).single(fileFieldName);
    }
    /***
     * Return multer object that's use as middleware for supporting upload multiple files
     * @param fileFieldName {string} File field name in form-data request
     * @param maxCount {int} Max count of files that can be uploaded
     * @return {*} Multer object
     */
    static array(fileFieldName, maxCount) {
        return multer({
            storage: multerMemoryStorage,
        }).array(fileFieldName, maxCount);
    }
    /***
     * Return multer object that's use as middleware for supporting upload files with custom fields and amount.
     * @param fields {Array} Array of object that contain field name and max count of files that can be uploaded
     * @return {*} Multer object
     */
    static fields(fields) {
        return multer({
            storage: multerMemoryStorage,
        }).fields(fields);
    }
}
module.exports = multerUploadMiddleware;
