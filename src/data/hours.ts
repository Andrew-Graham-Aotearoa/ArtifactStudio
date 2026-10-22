// Update this file each semester. The Contact page and the schema both read it.
// Times are 24-hour "HH:MM". A day with no opens/closes is shown as Closed.
export type DayHours = { day: string; opens?: string; closes?: string };

export const openingHours: DayHours[] = [
  { day: 'Monday', opens: '10:00', closes: '16:00' },
  { day: 'Tuesday', opens: '10:00', closes: '16:00' },
  { day: 'Wednesday', opens: '10:00', closes: '16:00' },
  { day: 'Thursday', opens: '10:00', closes: '16:00' },
  { day: 'Friday', opens: '10:00', closes: '16:00' },
  { day: 'Saturday', opens: '10:00', closes: '14:00' },
  { day: 'Sunday' },
];

// 16:00 -> "4pm", 09:30 -> "9:30am"
export function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}