
/**
 * Format progress as percentage
 */
export const formatProgress = (progress: number): string => {
  return `${Math.round(progress)}%`;
};

/**
 * Format duration in days
 */
export const formatDuration = (startDate: Date, endDate: Date): string => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay);
  
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  
  if (weeks === 1 && remainingDays === 0) return '1 week';
  if (remainingDays === 0) return `${weeks} weeks`;
  
  return `${weeks}w ${remainingDays}d`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};