import { cn } from '@/lib/utils';

import { ru } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';

import { buttonVariants } from './button';

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  buttonVariant = 'ghost',
  locale = ru,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      locale={locale}
      showOutsideDays={showOutsideDays}
      className={cn('group/calendar bg-background p-3', className)}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        month_caption: cn(
          'pointer-events-none flex h-8 w-full items-center justify-center px-8',
          defaultClassNames.month_caption,
        ),
        caption_label: cn('text-sm font-medium capitalize', defaultClassNames.caption_label),
        nav: cn(
          'pointer-events-none absolute inset-x-0 top-0 z-20 flex w-full items-center justify-between',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon-sm' }),
          'pointer-events-auto size-7 rounded-md p-0 aria-disabled:opacity-50',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon-sm' }),
          'pointer-events-auto size-7 rounded-md p-0 aria-disabled:opacity-50',
          defaultClassNames.button_next,
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('grid grid-cols-7', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground rounded-md text-center text-[0.8rem] font-normal',
          defaultClassNames.weekday,
        ),
        week: cn('mt-1 grid grid-cols-7', defaultClassNames.week),
        day: cn('relative p-0 text-center text-sm', defaultClassNames.day),
        day_button: cn(
          'inline-flex size-8 items-center justify-center rounded-full text-sm font-normal transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          defaultClassNames.day_button,
        ),
        selected: cn(
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary',
          '[&>button]:rounded-full',
          defaultClassNames.selected,
        ),
        today: cn(
          'text-foreground',
          '[&>button]:rounded-full [&>button]:bg-accent [&>button]:text-accent-foreground',
          defaultClassNames.today,
        ),
        outside: cn('text-muted-foreground opacity-50', defaultClassNames.outside),
        disabled: cn('text-muted-foreground opacity-40', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) =>
          orientation === 'left' ? (
            <ChevronLeftIcon className={cn('size-4', chevronClassName)} {...chevronProps} />
          ) : (
            <ChevronRightIcon className={cn('size-4', chevronClassName)} {...chevronProps} />
          ),
        ...components,
      }}
      {...props}
    />
  );
}
