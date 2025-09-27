import { isValidEmail } from './validation';

describe('isValidEmail', () => {
  // Test cases for valid emails
  test('should return true for valid email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('test.name@example.co.uk')).toBe(true);
    expect(isValidEmail('test_name@example.org')).toBe(true);
  });

  // Test cases for invalid emails based on the prompt
  test('should return false for emails missing @ or domain', () => {
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@no-local-part.com')).toBe(false);
    expect(isValidEmail('local-part-only@')).toBe(false);
    expect(isValidEmail('local@part@domain.com')).toBe(false);
  });

  test('should return false for domain/TLD issues', () => {
    expect(isValidEmail('user@localhost')).toBe(false);
    expect(isValidEmail('user@example.')).toBe(false);
    expect(isValidEmail('user@example.c')).toBe(false);
    expect(isValidEmail('user@-example.com')).toBe(false);
    expect(isValidEmail('user@example..com')).toBe(false);
  });

  test('should return false for invalid characters or spaces', () => {
    expect(isValidEmail('first last@example.com')).toBe(false);
    expect(isValidEmail('user@exam ple.com')).toBe(false);
    expect(isValidEmail('user#example.com')).toBe(false);
    expect(isValidEmail('usér@example.com')).toBe(false);
    expect(isValidEmail('user<>@example.com')).toBe(false);
  });

  test('should return false for dot problems in local-part', () => {
    expect(isValidEmail('.user@example.com')).toBe(false);
    expect(isValidEmail('user.@example.com')).toBe(false);
    expect(isValidEmail('us..er@example.com')).toBe(false);
  });

  test('should return false for quoting errors', () => {
    expect(isValidEmail('"quoted"@example.com')).toBe(false);
    expect(isValidEmail('"unclosed@example.com')).toBe(false);
  });

  test('should return false for length issues', () => {
    const longLocalPart = 'a'.repeat(65) + '@example.com';
    expect(isValidEmail(longLocalPart)).toBe(false);
  });

  test('should return false for common typos', () => {
    expect(isValidEmail('user@.com')).toBe(false);
    expect(isValidEmail('user@com')).toBe(false);
    expect(isValidEmail('user@domain,com')).toBe(false);
    expect(isValidEmail('user@domain..')).toBe(false);
    expect(isValidEmail('user@@domain.com')).toBe(false);
    expect(isValidEmail('user@domain.c_m')).toBe(false);
    expect(isValidEmail(' user@example.com ')).toBe(false);
  });
});