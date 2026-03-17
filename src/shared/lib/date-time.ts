export const formatDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const parseTimeToMinutes = (value: string): number | null => {
  const matched = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!matched) {
    return null;
  }

  const [, hours, minutes] = matched;

  return Number(hours) * 60 + Number(minutes);
};

export const calculateDurationHours = (startTime: string, endTime: string): number | null => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return null;
  }

  return (endMinutes - startMinutes) / 60;
};

export const addDays = (dateValue: string, amount: number): string => {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + amount);

  return formatDateInputValue(date);
};
