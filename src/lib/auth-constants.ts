// Shared authentication constants and validation patterns

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,20}$/;

export const PASSWORD_REQUIREMENTS = [
  { key: 'length', test: (pwd: string) => pwd.length >= 6, label: 'At least 6 characters' },
  { key: 'uppercase', test: (pwd: string) => /[A-Z]/.test(pwd), label: 'One uppercase letter (A-Z)' },
  { key: 'lowercase', test: (pwd: string) => /[a-z]/.test(pwd), label: 'One lowercase letter (a-z)' },
  { key: 'number', test: (pwd: string) => /\d/.test(pwd), label: 'One number (0-9)' },
  { key: 'special', test: (pwd: string) => /[!@#$%^&*]/.test(pwd), label: 'One special character (!@#$%^&*)' },
] as const;

export const validatePassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

export const getPasswordChecks = (password: string, confirmPassword?: string) => {
  return {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
    matches: confirmPassword !== undefined ? password === confirmPassword && confirmPassword !== '' : false,
  };
};
