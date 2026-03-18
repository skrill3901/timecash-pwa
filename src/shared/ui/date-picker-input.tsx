import { useMemo, useState } from 'react';

import { formatDateInputValue, formatRuDate } from '@shared/lib/date-time';

import { CalendarIcon } from 'lucide-react';

import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DatePickerInputProps {
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export const DatePickerInput = ({ label, onChange, value }: DatePickerInputProps) => {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => new Date(`${value}T00:00:00`), [value]);

  const handleSelect = (nextDate?: Date) => {
    if (!nextDate) {
      return;
    }

    onChange(formatDateInputValue(nextDate));
    setOpen(false);
  };

  return (
    <div className="block text-sm">
      <span className="mb-1 block">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm"
            aria-label={label}
          >
            <span>{formatRuDate(value)}</span>
            <CalendarIcon className="size-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} className="p-3" />
        </PopoverContent>
      </Popover>
    </div>
  );
};
