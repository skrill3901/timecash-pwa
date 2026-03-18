export const formatDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatRuDate = (dateValue: string): string => {
  const [year, month, day] = dateValue.split('-');

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day}.${month}.${year}`;
};

export const normalizeRuDateInput = (value: string): string => {
  const digits = value.replaceAll(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
};

export const parseRuDateInput = (value: string): string | null => {
  const matched = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());

  if (!matched) {
    return null;
  }

  const [, day, month, year] = matched;
  const iso = `${year}-${month}-${day}`;
  const date = new Date(`${iso}T00:00:00`);
  const isValid =
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === Number(year) &&
    date.getMonth() + 1 === Number(month) &&
    date.getDate() === Number(day);

  return isValid ? iso : null;
};

export const parseTimeToMinutes = (value: string): number | null => {
  const matched = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);

  if (!matched) {
    return null;
  }

  const [, hours, minutes] = matched;

  return Number(hours) * 60 + Number(minutes);
};

export const formatTimeInputValue = (value: string): string => {
  const digits = value.replaceAll(/\D/g, '').slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
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
