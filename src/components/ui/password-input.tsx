import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from './input';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  showVisibilityToggle?: boolean;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder,
  showVisibilityToggle = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="text-sm text-gray-700 mb-2 block">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={showVisibilityToggle ? 'pl-10 pr-10' : 'pl-10'}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
        {showVisibilityToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}
