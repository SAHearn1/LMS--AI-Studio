import React, { useState } from 'react';
import { LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm } from '../../components/auth';
import { Button } from '../../components/ui/button';

type View = 'login' | 'signup' | 'forgot' | 'reset';

const AuthDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('login');

  const handleLogin = async (email: string, password: string) => {
    console.log('Login:', { email, password });
    // Integrate with your auth service here
    alert(`Login with ${email}`);
  };

  const handleSignup = async (data: any) => {
    console.log('Signup:', data);
    // Integrate with your auth service here
    alert(`Signup with ${data.email}`);
  };

  const handleForgotPassword = async (email: string) => {
    console.log('Forgot password:', email);
    // Integrate with your auth service here
    alert(`Reset link sent to ${email}`);
  };

  const handleResetPassword = async (newPassword: string) => {
    console.log('Reset password');
    // Integrate with your auth service here
    alert('Password reset successful');
  };

  const handleGoogleAuth = () => {
    // Redirect to Google OAuth
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  const handleMicrosoftAuth = () => {
    // Redirect to Microsoft OAuth
    window.location.href = 'http://localhost:3001/api/auth/microsoft';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <Button
            variant={currentView === 'login' ? 'default' : 'outline'}
            onClick={() => setCurrentView('login')}
          >
            Login
          </Button>
          <Button
            variant={currentView === 'signup' ? 'default' : 'outline'}
            onClick={() => setCurrentView('signup')}
          >
            Signup
          </Button>
          <Button
            variant={currentView === 'forgot' ? 'default' : 'outline'}
            onClick={() => setCurrentView('forgot')}
          >
            Forgot Password
          </Button>
          <Button
            variant={currentView === 'reset' ? 'default' : 'outline'}
            onClick={() => setCurrentView('reset')}
          >
            Reset Password
          </Button>
        </div>
      </div>

      <div className="w-full">
        {currentView === 'login' && (
          <LoginForm
            onSubmit={handleLogin}
            onGoogleLogin={handleGoogleAuth}
            onMicrosoftLogin={handleMicrosoftAuth}
            onForgotPassword={() => setCurrentView('forgot')}
            onSignupClick={() => setCurrentView('signup')}
          />
        )}

        {currentView === 'signup' && (
          <SignupForm
            onSubmit={handleSignup}
            onGoogleSignup={handleGoogleAuth}
            onMicrosoftSignup={handleMicrosoftAuth}
            onLoginClick={() => setCurrentView('login')}
          />
        )}

        {currentView === 'forgot' && (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBackToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'reset' && (
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            token="demo-token"
          />
        )}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>This is a demo page showcasing the authentication UI components.</p>
        <p>Connect these forms to your backend API to enable full functionality.</p>
      </div>
    </div>
  );
};

export default AuthDemo;
