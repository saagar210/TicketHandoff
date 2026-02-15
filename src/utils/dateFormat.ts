/**
 * Format a date string consistently across the application
 * @param dateString ISO date string from the backend
 * @param includeYear Whether to include the year in the output
 * @returns Formatted date string (e.g., "Jan 15, 10:30 AM" or "Jan 15, 2025, 10:30 AM")
 */
export function formatDate(dateString: string, includeYear = false): string {
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  if (includeYear) {
    options.year = 'numeric';
  }

  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a date for display in lists (shorter format)
 * @param dateString ISO date string from the backend
 * @returns Formatted date string (e.g., "Jan 15, 10:30 AM")
 */
export function formatListDate(dateString: string): string {
  return formatDate(dateString, false);
}

/**
 * Format a date for detailed views (includes year)
 * @param dateString ISO date string from the backend
 * @returns Formatted date string (e.g., "Jan 15, 2025, 10:30 AM")
 */
export function formatDetailDate(dateString: string): string {
  return formatDate(dateString, true);
}

/**
 * Get relative time string (e.g., "2 hours ago", "yesterday")
 * @param dateString ISO date string from the backend
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return formatDate(dateString, true);
  }
}
