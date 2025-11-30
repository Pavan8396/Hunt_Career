// Helper function to escape regex special characters
const escapeRegex = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes . * + ? ^ $ { } ( ) | [ ] \
};

module.exports = { escapeRegex };
