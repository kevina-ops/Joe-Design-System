import { ClassValue } from 'clsx';

/**
 * Merges class names with Tailwind-aware deduplication.
 * Uses clsx for conditional class joining and tailwind-merge
 * for intelligent Tailwind CSS class conflict resolution.
 */
declare function cn(...inputs: ClassValue[]): string;

/**
 * Format a number as currency (USD).
 */
declare function formatCurrency(amount: number, locale?: string, currency?: string): string;
/**
 * Format a number as a compact display (e.g., 1.2K, 3.4M).
 */
declare function formatCompact(value: number, locale?: string): string;
/**
 * Format a Date as a localized date string.
 */
declare function formatDate(date: Date | string | number, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Format a Date as a relative time string (e.g., "2 hours ago").
 */
declare function formatRelativeTime(date: Date | string | number, locale?: string): string;

/**
 * Validate that a string is a non-empty value after trimming.
 */
declare function isNonEmpty(value: string | null | undefined): value is string;
/**
 * Validate that a string is a valid email address (basic check).
 */
declare function isValidEmail(value: string): boolean;
/**
 * Validate that a string is a valid URL.
 */
declare function isValidUrl(value: string): boolean;
/**
 * Validate that a value is a positive number.
 */
declare function isPositiveNumber(value: unknown): value is number;

export { cn, formatCompact, formatCurrency, formatDate, formatRelativeTime, isNonEmpty, isPositiveNumber, isValidEmail, isValidUrl };
