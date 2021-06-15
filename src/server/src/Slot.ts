type SlotAssignment = number | "backup" | "none";

type SlotStatus =
  | "unavailable"
  | "assigned"
  | "claimed"
  | "missed"
  | "confirmed";
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Slot = {
  term: number;
  startH: string;
  endH: string;
  date: Date;
};

export enum Priority {
  MAX = 1,
  MID = 2,
  LOW = 3,
  NONE = 4,
}

export type RecurringSlot = {
  day: DayOfWeek;
  startH: string;
  endH: string;
};

export type Availability = {
  shortcode: string;
  priority: Priority;
  recurring_id: number;
  assigned: SlotAssignment;
};

// Parses a string of format "DayOfWeek startH - endH"
export function recurringSlotFromString(data: string): RecurringSlot {
  const split: string[] = data.split(" ");
  const [day, start, end] = split.filter((str) => !str.includes("-")); // Disregard the '-'
  return { day: day as DayOfWeek, startH: start, endH: end };
}

export const slotFromJson = (json: any): Slot => {
  const { term, startH, endH, date } = json;
  const d = new Date();
  d.setUTCFullYear(date.year);
  d.setUTCMonth(date.month - 1);
  d.setUTCDate(date.day);

  return {
    term: 3, // TODO: Use actual term
    startH: startH,
    endH: endH,
    date: d,
  };
};
