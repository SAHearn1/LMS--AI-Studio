import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { useToast } from '../hooks/use-toast';
import { Toaster } from './Toaster';

/**
 * Toast notification component for displaying temporary messages.
 * Built with Radix UI and fully accessible.
 */
const meta = {
  title: 'Components/Toast',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div>
        <Button
          onClick={() => {
            toast({
              title: 'Notification',
              description: 'This is a default toast notification.',
            });
          }}
        >
          Show Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const Success: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div>
        <Button
          onClick={() => {
            toast({
              variant: 'success',
              title: 'Success!',
              description: 'Your changes have been saved.',
            });
          }}
        >
          Show Success Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const Destructive: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div>
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Something went wrong. Please try again.',
            });
          }}
        >
          Show Error Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const WithAction: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div>
        <Button
          onClick={() => {
            toast({
              title: 'Update Available',
              description: 'A new version is available.',
              action: (
                <Button variant="outline" size="sm" onClick={() => alert('Updating...')}>
                  Update
                </Button>
              ),
            });
          }}
        >
          Show Toast with Action
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div>
        <Button
          onClick={() => {
            toast({
              title: 'First notification',
              description: 'This is the first toast.',
            });
            setTimeout(() => {
              toast({
                variant: 'success',
                title: 'Second notification',
                description: 'This is the second toast.',
              });
            }, 500);
            setTimeout(() => {
              toast({
                variant: 'destructive',
                title: 'Third notification',
                description: 'This is the third toast.',
              });
            }, 1000);
          }}
        >
          Show Multiple Toasts
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const TitleOnly: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div>
        <Button
          onClick={() => {
            toast({
              title: 'Saved successfully',
            });
          }}
        >
          Show Title Only Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div>
        <Button
          onClick={() => {
            toast({
              title: 'Detailed Notification',
              description:
                'This is a longer toast notification with more content to demonstrate how the toast handles longer text. It should wrap properly and remain readable.',
            });
          }}
        >
          Show Long Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};
