import englishOnly from "./englishOnly";

const passwordValidator = require('password-validator');

let schema = new passwordValidator();

schema.has().letters().has().digits().is().min(8);
// schema.has().letters().has().digits().has().symbols().has().uppercase().is().min(8);

/**
 * Returns true if the password is string and valid. Otherwise, false.
 * @param password {string} The password to test.
 * @return {boolean} true if password is valid. Otherwise, false.
 */
function myPasswordValidator(password: string): boolean {
  return schema.validate(password) && englishOnly(password);
}

export default myPasswordValidator;