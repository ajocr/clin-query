import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { AuthLayout } from './auth/AuthLayout';
import { ErrorAlert } from './ui/error-alert';
import { PasswordInput } from './ui/password-input';
import { PASSWORD_REGEX } from '../lib/auth-constants';

interface ForgotPasswordProps {
  onSuccess: () => void;
  onBack: () => void;
}

type ForgotPasswordStep = 'request' | 'confirm';

export function ForgotPassword({ onSuccess, onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<ForgotPasswordStep>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request reset code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await resetPassword({ username: email });
      setStep('confirm');
    } catch (err: any) {
      if (err.name === 'UserNotFoundException') {
        setError('No account found with this email address.');
      } else if (err.name === 'LimitExceededException') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Failed to send reset code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Confirm reset with code + new password
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setError('Password does not meet requirements.');
      return;
    }

    setIsLoading(true);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword
      });

      onSuccess();
    } catch (err: any) {
      if (err.name === 'CodeMismatchException') {
        setError('Invalid verification code. Please check your email.');
      } else if (err.name === 'ExpiredCodeException') {
        setError('Verification code has expired. Please request a new one.');
        setStep('request');
      } else if (err.name === 'InvalidPasswordException') {
        setError('Password does not meet requirements.');
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Request Reset Code
  if (step === 'request') {
    return (
      <AuthLayout
        title="Reset Your Password"
        subtitle="Enter your email address and we'll send you a reset code."
      >
        <form onSubmit={handleRequestReset} className="space-y-6">
          <ErrorAlert message={error} />

          <div>
            <label htmlFor="email" className="text-sm text-gray-700 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            variant="logo_orange"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Code'}
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

  // Step 2: Enter Code + New Password
  return (
    <AuthLayout
      title="Enter Reset Code"
      subtitle={
        <>
          We sent a reset code to <strong>{email}</strong>.
          Check your inbox and enter it below.
        </>
      }
    >
      <form onSubmit={handleConfirmReset} className="space-y-6">
        <ErrorAlert message={error} />

        {/* Verification Code */}
        <div>
          <label htmlFor="code" className="text-sm text-gray-700 mb-2 block">
            Verification Code
          </label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
            disabled={isLoading}
          />
        </div>

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
          showVisibilityToggle={false}
        />

        {/* Password match indicator */}
        {confirmPassword && (
          <div className="flex items-center gap-2">
            <CheckCircle
              className={`w-4 h-4 ${
                newPassword === confirmPassword
                  ? 'text-green-500'
                  : 'text-gray-300'
              }`}
            />
            <span className={`text-xs ${
              newPassword === confirmPassword
                ? 'text-green-700'
                : 'text-gray-500'
            }`}>
              Passwords match
            </span>
          </div>
        )}

        <Button
          variant="logo_orange"
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>

        {/* Resend code */}
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Didn't receive the code?{' '}
          </span>
          <button
            type="button"
            onClick={() => setStep('request')}
            className="text-sm text-blue-600 hover:text-blue-700"
            disabled={isLoading}
          >
            Resend
          </button>
        </div>

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
