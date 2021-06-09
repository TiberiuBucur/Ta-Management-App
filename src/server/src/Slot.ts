type SlotAssignment = number | "backup" | "none"

type SlotStatus = "unavailable" | "assigned" | "claimed" | "missed" | "confirmed"

export type Slot = {
  term: number;
  startH: string;
  endH: string;
  date: Date;
}

export const slotFromJson = (json: any): Slot => {
  const { term, start_hour, end_hour, date } = json;

  return {
    term: term as number,
    startH: start_hour as string,
    endH: end_hour as string,
    date: date as Date
  }
}