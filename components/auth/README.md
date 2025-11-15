# Authentication UI Components

This directory contains reusable authentication UI components built with **shadcn/ui** and **Tailwind CSS**.

## Components

### 1. LoginForm
A complete login form with email/password authentication and OAuth options.

**Features:**
- Email and password inputs with validation
- Google OAuth button
- Microsoft OAuth button
- "Forgot password" link
- "Sign up" link
- Loading states
- Error handling

**Usage:**
```tsx
import { LoginForm } from '@/components/auth';

<LoginForm
  onSubmit={async (email, password) => {
    // Handle login
  }}
  onGoogleLogin={() => {
    // Redirect to Google OAuth
  }}
  onMicrosoftLogin={() => {
    // Redirect to Microsoft OAuth
  }}
  onForgotPassword={() => {
    // Navigate to forgot password page
  }}
  onSignupClick={() => {
    // Navigate to signup page
  }}
/>
```

### 2. SignupForm
A comprehensive signup form with password validation and OAuth options.

**Features:**
- First name and last name inputs
- Email input with validation
- Password input with strength requirements
- Confirm password input
- Real-time password validation feedback
- Google OAuth button
- Microsoft OAuth button
- "Login" link for existing users
- Loading states
- Error handling

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Usage:**
```tsx
import { SignupForm } from '@/components/auth';

<SignupForm
  onSubmit={async (data) => {
    // Handle signup
    // data: { email, password, firstName?, lastName? }
  }}
  onGoogleSignup={() => {
    // Redirect to Google OAuth
  }}
  onMicrosoftSignup={() => {
    // Redirect to Microsoft OAuth
  }}
  onLoginClick={() => {
    // Navigate to login page
  }}
/>
```

### 3. ForgotPasswordForm
A simple form for requesting password reset emails.

**Features:**
- Email input
- Success message after submission
- Error handling
- "Back to Login" button
- Loading states

**Usage:**
```tsx
import { ForgotPasswordForm } from '@/components/auth';

<ForgotPasswordForm
  onSubmit={async (email) => {
    // Send password reset email
  }}
  onBackToLogin={() => {
    // Navigate back to login
  }}
/>
```

### 4. ResetPasswordForm
A form for resetting passwords with a token.

**Features:**
- New password input with validation
- Confirm password input
- Real-time password validation feedback
- Success message after reset
- Error handling
- Loading states

**Usage:**
```tsx
import { ResetPasswordForm } from '@/components/auth';

<ResetPasswordForm
  token="reset-token-from-url"
  onSubmit={async (newPassword) => {
    // Reset password with token
  }}
/>
```

## Demo

A demo page is available at `src/pages/AuthDemo.tsx` that showcases all authentication components.

To view the demo:
1. Run `npm run dev`
2. Navigate to the auth demo page in your application

## Styling

All components use Tailwind CSS with the shadcn/ui design system. The following CSS variables are used:

- `--background`: Main background color
- `--foreground`: Main text color
- `--primary`: Primary action color
- `--destructive`: Error/danger color
- `--muted`: Muted text color
- `--border`: Border color
- `--input`: Input border color
- `--ring`: Focus ring color

These can be customized in `src/styles/globals.css`.

## Integration with Backend

To integrate these components with your authentication API:

1. Install axios (already included):
```bash
npm install axios
```

2. Create an auth service (see `docs/FRONTEND_INTEGRATION.md` for complete example):
```typescript
// services/authService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  async signup(data: any) {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email,
    });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  },

  loginWithGoogle() {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  loginWithMicrosoft() {
    window.location.href = `${API_BASE_URL}/auth/microsoft`;
  },
};
```

3. Use the service in your components:
```tsx
import { LoginForm } from '@/components/auth';
import { authService } from '@/services/authService';

function LoginPage() {
  return (
    <LoginForm
      onSubmit={authService.login}
      onGoogleLogin={authService.loginWithGoogle}
      onMicrosoftLogin={authService.loginWithMicrosoft}
      onForgotPassword={() => navigate('/forgot-password')}
      onSignupClick={() => navigate('/signup')}
    />
  );
}
```

## Dependencies

- React
- Tailwind CSS
- class-variance-authority
- clsx
- tailwind-merge
- @radix-ui/react-label
- lucide-react (for icons, if needed)

## License

MIT
