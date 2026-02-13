import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { signIn } from 'aws-amplify/auth';
import { ForceChangePassword } from './ForceChangePassword';
import { ForgotPassword } from './ForgotPassword';
import { AuthLayout } from './auth/AuthLayout';
import { ErrorAlert } from './ui/error-alert';
import { PasswordInput } from './ui/password-input';

interface LoginProps {
  onLogin: () => void;
}

type AuthScreen = 'login' | 'force-change-password' | 'forgot-password';

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      });

      if (isSignedIn) {
        onLogin();
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setCurrentScreen('force-change-password');
      }
    } catch (err: any) {
      if (err.name === 'UserNotFoundException') {
        setError('No account found with this email address.');
      } else if (err.name === 'NotAuthorizedException') {
        setError('Incorrect email or password.');
      } else if (err.name === 'UserNotConfirmedException') {
        setError('Please verify your email address first.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show force change password screen
  if (currentScreen === 'force-change-password') {
    return (
      <ForceChangePassword
        onSuccess={onLogin}
        onBack={() => setCurrentScreen('login')}
      />
    );
  }

  // Show forgot password screen
  if (currentScreen === 'forgot-password') {
    return (
      <ForgotPassword
        onSuccess={() => setCurrentScreen('login')}
        onBack={() => setCurrentScreen('login')}
      />
    );
  }

  // Main login screen
  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorAlert message={error} />

        {/* Email Input */}
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
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Input */}
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          required
          disabled={isLoading}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading}
            />
            <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={() => setCurrentScreen('forgot-password')}
            className="text-sm text-blue-600 hover:text-blue-700"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <Button
          variant="logo_orange"
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button className="text-blue-600 hover:text-blue-700">
            Request Access
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
