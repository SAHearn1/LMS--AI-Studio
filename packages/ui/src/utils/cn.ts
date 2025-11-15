import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names using clsx
 * This helps combine Tailwind classes and handle conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
