/**
 * Format a number as currency (USD).
 */
export function formatCurrency(
    amount: number,
    locale = "en-US",
    currency = "USD"
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}

/**
 * Format a number as a compact display (e.g., 1.2K, 3.4M).
 */
export function formatCompact(
    value: number,
    locale = "en-US"
): string {
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
    }).format(value);
}

/**
 * Format a Date as a localized date string.
 */
export function formatDate(
    date: Date | string | number,
    locale = "en-US",
    options?: Intl.DateTimeFormatOptions
): string {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options,
    }).format(d);
}

/**
 * Format a Date as a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(
    date: Date | string | number,
    locale = "en-US"
): string {
    const d = date instanceof Date ? date : new Date(date);
    const now = Date.now();
    const diffMs = now - d.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (diffDays > 0) return rtf.format(-diffDays, "day");
    if (diffHours > 0) return rtf.format(-diffHours, "hour");
    if (diffMinutes > 0) return rtf.format(-diffMinutes, "minute");
    return rtf.format(-diffSeconds, "second");
}
