import type { Meta, StoryObj } from '@storybook/react';
import { Progress, CircularProgress, Spinner } from './Progress';
import { useState } from 'react';
import { Button } from './Button';

/**
 * Progress indicators for showing task completion.
 * Includes linear, circular, and spinner variants.
 */
const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Progress value={50} className="w-[400px]" />,
};

export const Different: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    const startProgress = () => {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    };

    return (
      <div className="space-y-4 w-[400px]">
        <Progress value={progress} />
        <Button onClick={startProgress} className="w-full">
          Start Progress
        </Button>
      </div>
    );
  },
};

export const Thin: Story = {
  render: () => <Progress value={65} className="w-[400px] h-2" />,
};

export const Thick: Story = {
  render: () => <Progress value={65} className="w-[400px] h-6" />,
};

export const Circular: Story = {
  render: () => (
    <div className="flex gap-8">
      <CircularProgress value={25} />
      <CircularProgress value={50} />
      <CircularProgress value={75} />
      <CircularProgress value={100} />
    </div>
  ),
};

export const CircularWithValue: Story = {
  render: () => (
    <div className="flex gap-8">
      <CircularProgress value={25} showValue />
      <CircularProgress value={50} showValue />
      <CircularProgress value={75} showValue />
      <CircularProgress value={100} showValue />
    </div>
  ),
};

export const CircularSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <CircularProgress value={60} size={80} strokeWidth={6} showValue />
      <CircularProgress value={60} size={120} strokeWidth={8} showValue />
      <CircularProgress value={60} size={160} strokeWidth={10} showValue />
    </div>
  ),
};

export const SpinnerSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const SpinnerInButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>
        <Spinner size="sm" className="mr-2" />
        Loading...
      </Button>
      <Button variant="outline" disabled>
        <Spinner size="sm" className="mr-2" />
        Processing
      </Button>
    </div>
  ),
};

export const UploadProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const startUpload = () => {
      setUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setUploading(false), 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);
    };

    return (
      <div className="space-y-4 w-[400px]">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading file...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <Button onClick={startUpload} disabled={uploading} className="w-full">
          {uploading ? 'Uploading...' : 'Start Upload'}
        </Button>
      </div>
    );
  },
};
