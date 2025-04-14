import { words } from '@/constants/words';

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Ensuring whole number

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): string => {
  const parseDateTime = (date: string, time: string) => {
    const [day, month, year] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const start = parseDateTime(startDate, startTime);
  const end = parseDateTime(endDate, endTime);

  const durationMs = end.getTime() - start.getTime();
  if (durationMs <= 0) return 'Invalid Duration';

  const totalMinutes = Math.floor(durationMs / (1000 * 60)); // Convert to total minutes
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const days = Math.floor(totalMinutes / (60 * 24));

  return `${days > 0 ? `${days}d ` : ''}${
    hours > 0 ? `${hours}h ` : ''
  }${minutes}m`.trim();
};

export function getTimeInMs(date: string, time: string): number {
  const [day, month, year] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  const targetDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  return targetDate.getTime();
}

export function formatTimeDurationForString(timeString: string): string {
  const [days, hours, minutes, seconds] = timeString.split(':').map(Number);

  const parts = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'Hour' : 'Hours'}`);
  if (minutes > 0)
    parts.push(`${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`);
  if (seconds > 0)
    parts.push(`${seconds} ${seconds === 1 ? 'Second' : 'Seconds'}`);

  return parts.length > 0 ? parts.join(', ') : '0 Seconds';
}

export function getMillisecondsFromTimeString(timeString: string): number {
  const [days, hours, minutes, seconds] = timeString.split(':').map(Number);

  // Convert to milliseconds
  const totalMs =
    days * 24 * 60 * 60 * 1000 + // Days to ms
    hours * 60 * 60 * 1000 + // Hours to ms
    minutes * 60 * 1000 + // Minutes to ms
    seconds * 1000; // Seconds to ms

  // Get current time in milliseconds (adjusted for timezone in production)
  const currentTimeMS =
    new Date().getTime() -
    (process.env.NODE_ENV! !== 'development'
      ? new Date().getTimezoneOffset() * 60000
      : 0);

  return currentTimeMS + totalMs;
}

export function getMillisecondsFromTimeStringFromLocalStorage(
  timeString: string,
  currentTimeMS: number
): number {
  const [days, hours, minutes, seconds] = timeString.split(':').map(Number);

  // Convert to milliseconds
  const totalMs =
    days * 24 * 60 * 60 * 1000 + // Days to ms
    hours * 60 * 60 * 1000 + // Hours to ms
    minutes * 60 * 1000 + // Minutes to ms
    seconds * 1000; // Seconds to ms

  const total = currentTimeMS + totalMs;
  return total;
}

export function getDurationCalculation(
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): string {
  // Convert start and end date-time strings to Date objects
  const [startDay, startMonth, startYear] = startDate.split('-').map(Number);
  const [startHour, startMinute] = startTime.split(':').map(Number);

  const [endDay, endMonth, endYear] = endDate.split('-').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startDateTime = new Date(
    startYear,
    startMonth - 1,
    startDay,
    startHour,
    startMinute
  );
  const endDateTime = new Date(
    endYear,
    endMonth - 1,
    endDay,
    endHour,
    endMinute
  );

  // Get time difference in milliseconds
  let diffMs = endDateTime.getTime() - startDateTime.getTime();

  if (diffMs < 0) return '00:00:00:00'; // Return 0 if start is after end

  // Convert milliseconds to days, hours, minutes, and seconds
  const seconds = Math.floor(diffMs / 1000) % 60;
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Format output as "dd:hh:mm:ss"
  return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const generateToken = (
  username: string,
  enrollmentNumber: string
): string => {
  const userPart = username.slice(0, 4);

  const enrollmentPart = String(enrollmentNumber).slice(-4);

  const randomWord = words[Math.floor(Math.random() * words.length)];

  const randomNumber = Math.floor(Math.random() * 90) + 10;

  return `${userPart}${enrollmentPart}${randomWord}${randomNumber}`;
};

export const generateRandomPassword = (
  username: string,
  enrollmentNumber: string
) => {
  const randomNumber = Math.floor(Math.random() * 999) + 10;

  const userPart = username.toLowerCase().slice(0, 4);

  const enrollmentPart = String(enrollmentNumber).slice(-4);
  return randomNumber + userPart + enrollmentPart;
};

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export function convertToJSON(dataStr: string): { isCorrect: boolean } {
  // Extract the value from the string. Assuming format is "isCorrect: value"
  const regex = /isCorrect:\s*(\d+)/;
  const match = dataStr.match(regex);

  if (match) {
    // Convert the value to a boolean (0 -> false, any other value -> true)
    const value = parseInt(match[1], 10);
    return {
      isCorrect: Boolean(value), // Converts 0 to false, non-zero to true
    };
  } else {
    throw new Error('Invalid data format');
  }
}

export function getRetryMessage(
  remainingMinutes: number,
  remainingSeconds: number
) {
  if (remainingMinutes > 0 && remainingSeconds > 0) {
    return `Please try again after ${remainingMinutes} minute(s) and ${remainingSeconds} second(s).`;
  } else if (remainingMinutes > 0) {
    return `Please try again after ${remainingMinutes} minute(s).`;
  } else if (remainingSeconds > 0) {
    return `Please try again after ${remainingSeconds} second(s).`;
  } else {
    return `Please try again now.`;
  }
}
