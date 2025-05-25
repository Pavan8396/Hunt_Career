// Helper function to escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes . * + ? ^ $ { } ( ) | [ ] \
};

module.exports = { escapeRegex };
