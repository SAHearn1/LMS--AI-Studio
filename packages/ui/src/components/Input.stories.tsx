import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, Mail, Eye } from 'lucide-react';

/**
 * Input component with error states and icon support.
 * Accessible with proper ARIA attributes and dark mode support.
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Email address',
    error: 'This field is required',
    id: 'email-error',
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    icon: <Search className="h-4 w-4" />,
    iconPosition: 'left',
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Email address',
    icon: <Mail className="h-4 w-4" />,
    iconPosition: 'right',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
    icon: <Eye className="h-4 w-4" />,
    iconPosition: 'right',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
    icon: <Mail className="h-4 w-4" />,
    iconPosition: 'left',
  },
};

export const WithErrorAndIcon: Story = {
  args: {
    placeholder: 'Search query',
    icon: <Search className="h-4 w-4" />,
    iconPosition: 'left',
    error: 'Please enter at least 3 characters',
    id: 'search-error',
  },
};
