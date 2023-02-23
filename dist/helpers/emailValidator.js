/**
 * Check if email is valid.
 * @param email {string} The email to test.
 * @return {boolean} true if the email is valid. Otherwise, false.
 */
function emailValidator(email) {
    if (/^\S+@\S+\.\S+$/.test(email)) {
        return englishOnly(email);
    }
    else {
        return false;
    }
}
module.exports = emailValidator;
