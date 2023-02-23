import englishOnly from './englishOnly'

/**
 * Check if email is valid.
 * @param email {string} The email to test.
 * @return {boolean} true if the email is valid. Otherwise, false.
 */
function emailValidator(email: string): boolean {
    if (/^\S+@\S+\.\S+$/.test(email)) {
        return englishOnly(email);
    } else {
        return false;
    }
}

export default emailValidator;