import { validatePasswordStrength } from '../../../utils/password.utils';
import { hashPassword, comparePassword } from '../../../utils/password.utils';

describe('Password Utils', () => {
  describe('validatePasswordStrength', () => {
    it('should validate a strong password', () => {
      const result = validatePasswordStrength('StrongPass123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject a password that is too short', () => {
      const result = validatePasswordStrength('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject a password without uppercase', () => {
      const result = validatePasswordStrength('noupppercase123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject a password without lowercase', () => {
      const result = validatePasswordStrength('NOLOWERCASE123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject a password without numbers', () => {
      const result = validatePasswordStrength('NoNumbers!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject a password without special characters', () => {
      const result = validatePasswordStrength('NoSpecial123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });

  describe('hashPassword and comparePassword', () => {
    it('should hash a password and verify it', async () => {
      const password = 'TestPassword123!';
      const hashed = await hashPassword(password);
      
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
      
      const isValid = await comparePassword(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should fail to verify an incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hashed = await hashPassword(password);
      
      const isValid = await comparePassword(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });
  });
});
