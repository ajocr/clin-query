import { ReactNode } from 'react';
import { Card } from '../ui/card';
import Logo from '../../assets/logo.png';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: ReactNode;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <img src={Logo} alt="ClinQuery Logo" />

          {(title || subtitle) && (
            <div className="mb-6 mt-4">
              {title && (
                <h2 className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </Card>
      </div>
    </div>
  );
}
