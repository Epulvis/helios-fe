import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDateIndonesia(isoDateString?: string): string {
  if (!isoDateString) return '-';
  try {
    const date = parseISO(isoDateString);
    return format(date, "dd MMM yyyy, HH:mm 'WIB'", { locale: id });
  } catch {
    return isoDateString;
  }
}
