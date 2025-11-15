# Authentication UI Components - Visual Guide

This document provides a visual overview of the authentication UI components built with shadcn/ui.

## Components Overview

### 1. Login Form

The Login Form provides a clean, professional interface for user authentication.

**Features:**
- Email and password inputs with validation
- "Forgot password?" link
- Social login buttons (Google, Microsoft)
- "Sign up" link for new users
- Loading states and error handling

**Visual Elements:**
- Card-based layout with shadow
- Primary action button for login
- Secondary outlined buttons for OAuth
- Divider with "Or continue with" text
- Error messages in destructive color scheme

### 2. Signup Form

The Signup Form includes comprehensive validation and user feedback.

**Features:**
- First name and last name fields
- Email input
- Password field with strength requirements
- Confirm password field
- Real-time password validation feedback
- Social signup buttons (Google, Microsoft)
- "Login" link for existing users

**Visual Elements:**
- Two-column layout for name fields
- Password requirements displayed inline
- List of validation errors in destructive color
- Success checkmarks when requirements met

### 3. Forgot Password Form

A simple, focused form for password reset requests.

**Features:**
- Email input field
- Success message after submission
- "Back to Login" button
- Clear instructions

**Visual Elements:**
- Minimal, focused design
- Success state with green background
- Clear call-to-action buttons

### 4. Reset Password Form

Allows users to create a new password with validation.

**Features:**
- New password input with validation
- Confirm password input
- Password strength requirements display
- Success state with redirect option

**Visual Elements:**
- Real-time validation feedback
- Success message with action button
- Clear error messaging

## Color Scheme

The components use a semantic color system:

- **Primary**: Deep blue-grey (#0F172A) for main actions
- **Secondary**: Light grey (#F8FAFC) for secondary actions  
- **Destructive**: Red (#DC2626) for errors and warnings
- **Muted**: Grey (#64748B) for secondary text
- **Border**: Light grey (#E2E8F0) for borders
- **Background**: White (#FFFFFF) for main background

## Dark Mode Support

All components include dark mode variants:
- Dark background: #0F172A
- Dark foreground: #F8FAFC
- Adjusted colors for optimal contrast

## Accessibility

- All form inputs have associated labels
- Proper ARIA attributes
- Keyboard navigation support
- Focus states on all interactive elements
- Error messages are announced to screen readers

## Responsive Design

- Mobile-first approach
- Adapts to different screen sizes
- Touch-friendly button sizes
- Proper spacing on mobile devices

## Integration

To see the components in action:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the auth demo page in your browser

3. Test different states:
   - Normal state
   - Loading state
   - Error state
   - Success state

## Customization

The components can be customized by modifying:
- `src/styles/globals.css` - Color variables and base styles
- `tailwind.config.cjs` - Tailwind theme configuration
- Individual component files - Component-specific styles

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

For implementation details and code examples, see `components/auth/README.md`.
