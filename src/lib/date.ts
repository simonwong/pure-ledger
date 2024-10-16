import { format } from 'date-fns';

export const dateShow = (date: string) => {
  return format(date, 'yyyy-MM-dd');
};
