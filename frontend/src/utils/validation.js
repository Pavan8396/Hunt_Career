/**
 * Validates an email address against a comprehensive set of rules.
 *
 * @param {string} email The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export const isValidEmail = (email) => {
  if (!email) {
    return false;
  }

  // Rule: No leading/trailing spaces
  if (email.trim() !== email) {
    return false;
  }

  // Rule: Disallow non-ASCII characters
  if (/[^\x00-\x7F]/.test(email)) {
    return false;
  }

  // Rule: Disallow quoted local parts (which are valid by RFC but often rejected)
  if (email.split('@')[0].startsWith('"')) {
      return false;
  }

  // Rule: Disallow single quotes, as per user feedback
  if (email.includes("'")) {
    return false;
  }

  // This regex is based on the original but with fixes:
  // 1. Removed the quoted local-part alternative.
  // 2. Made the domain part stricter to disallow leading/trailing hyphens.
  const emailRegex = new RegExp(
    /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}))$/
  );

  if (!emailRegex.test(email)) {
      return false;
  }

  // Additional checks for robustness
  if (email.length > 320) {
    return false;
  }
  if (email.split('@')[0].length > 64) {
    return false;
  }

  return true;
};