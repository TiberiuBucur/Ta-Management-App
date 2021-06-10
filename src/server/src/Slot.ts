type SlotAssignment = number | "backup" | "none"

type SlotStatus = "unavailable" | "assigned" | "claimed" | "missed" | "confirmed"

export type Slot = {
  term: number;
  startH: string;
  endH: string;
  date: Date;
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
    date: d
  }
}
