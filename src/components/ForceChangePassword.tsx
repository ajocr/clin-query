import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { confirmSignIn } from 'aws-amplify/auth';
import { AuthLayout } from './auth/AuthLayout';
import { ErrorAlert } from './ui/error-alert';
import { PasswordInput } from './ui/password-input';
import { PASSWORD_REGEX, getPasswordChecks } from '../lib/auth-constants';

interface ForceChangePasswordProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function ForceChangePassword({ onSuccess, onBack }: ForceChangePasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = getPasswordChecks(newPassword, confirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password complexity
    if (!PASSWORD_REGEX.test(newPassword)) {
      setError('Password does not meet the requirements below.');
      return;
    }

    setIsLoading(true);

    try {
      const { isSignedIn } = await confirmSignIn({
        challengeResponse: newPassword
      });

      if (isSignedIn) {
        onSuccess();
      }
    } catch (err: any) {
      if (err.name === 'InvalidPasswordException') {
        setError('Password does not meet requirements.');
      } else if (err.name === 'InvalidParameterException') {
        setError('Invalid password format.');
      } else {
        setError(err.message || 'Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Change Your Password"
      subtitle="For security, you must set a new password before continuing."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorAlert message={error} />

        {/* New Password */}
        <PasswordInput
          id="newPassword"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        {/* Confirm Password */}
        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Password Requirements:
          </p>
          {[
            { check: passwordChecks.length, label: 'At least 6 characters' },
            { check: passwordChecks.uppercase, label: 'One uppercase letter (A-Z)' },
            { check: passwordChecks.lowercase, label: 'One lowercase letter (a-z)' },
            { check: passwordChecks.number, label: 'One number (0-9)' },
            { check: passwordChecks.special, label: 'One special character (!@#$%^&*)' },
            { check: passwordChecks.matches, label: 'Passwords match' },
          ].map(({ check, label }) => (
            <div key={label} className="flex items-center gap-2">
              <CheckCircle
                className={`w-4 h-4 flex-shrink-0 ${
                  check ? 'text-green-500' : 'text-gray-300'
                }`}
              />
              <span className={`text-xs ${check ? 'text-green-700' : 'text-gray-500'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <Button
          variant="logo_orange"
          type="submit"
          className="w-full"
          disabled={isLoading || !Object.values(passwordChecks).every(Boolean)}
        >
          {isLoading ? 'Changing Password...' : 'Set New Password'}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-sm text-gray-600 hover:text-gray-800"
          disabled={isLoading}
        >
          ← Back to Login
        </button>
      </form>
    </AuthLayout>
  );
}
