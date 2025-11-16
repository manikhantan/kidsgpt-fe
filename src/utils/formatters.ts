import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

/**
 * Formats a date string to include time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

/**
 * Formats a date as relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Formats a timestamp for chat messages
 */
export const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }

  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`;
  }

  return format(date, 'MMM d, h:mm a');
};

/**
 * Formats a number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formats a user's name for display
 */
export const formatUserName = (name: string): string => {
  return name
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};
