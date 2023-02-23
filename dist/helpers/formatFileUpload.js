const fs = require("fs");
/**
 * Test if the string is only english letters and symbols.
 * @param str {string} The string to test.
 * @return {boolean} true if the string is only english letters and symbols. Otherwise, false.
 */
function formatFileUpload(file) {
    let img = fs.readFileSync(file.path);
    let encodeImg = img.toString('base64');
    let finalImg = {
        contentType: file.mimetype,
        dataImg: Buffer.from(encodeImg, 'base64')
    };
    return finalImg;
}
module.exports = formatFileUpload;
