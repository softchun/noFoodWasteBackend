/**
 * Test if the string is only english letters and symbols.
 * @param str {string} The string to test.
 * @return {boolean} true if the string is only english letters and symbols. Otherwise, false.
 */
function englishOnly(str) {
    return /^[~`!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-]+$/.test(str);
}
module.exports = englishOnly;
