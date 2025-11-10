import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonButton } from './Skeleton';

/**
 * Skeleton components for loading states.
 * Provides visual feedback while content is loading.
 */
const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
};

export const Text: Story = {
  render: () => (
    <div className="w-[400px]">
      <SkeletonText lines={5} />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="w-[350px]">
      <SkeletonCard />
    </div>
  ),
};

export const Avatar: Story = {
  render: () => (
    <div className="flex gap-4">
      <SkeletonAvatar />
      <SkeletonAvatar className="h-16 w-16" />
      <SkeletonAvatar className="h-20 w-20" />
    </div>
  ),
};

export const Button: Story = {
  render: () => (
    <div className="flex gap-2">
      <SkeletonButton />
      <SkeletonButton className="w-32" />
    </div>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="flex items-center gap-4">
        <SkeletonAvatar className="h-20 w-20" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex gap-2">
        <SkeletonButton className="flex-1" />
        <SkeletonButton className="flex-1" />
      </div>
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <div className="w-[600px] space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[900px]">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
};
