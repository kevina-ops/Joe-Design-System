/**
 * Validate that a string is a non-empty value after trimming.
 */
export function isNonEmpty(value: string | null | undefined): value is string {
    return value != null && value.trim().length > 0;
}

/**
 * Validate that a string is a valid email address (basic check).
 */
export function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validate that a string is a valid URL.
 */
export function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate that a value is a positive number.
 */
export function isPositiveNumber(value: unknown): value is number {
    return typeof value === "number" && !Number.isNaN(value) && value > 0;
}
