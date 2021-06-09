type SlotAssignment = number | "backup" | "none"

type SlotStatus = "unavailable" | "assigned" | "claimed" | "missed" | "confirmed"

export type Slot = {
  term: number;
  startH: string;
  endH: string;
  assignment: SlotAssignment;
  status: string;
  date: {
    day: number;
    month: number;
    year: number;
  };
}

export const slotFromJson = (json: any): Slot => {
  const { term, start_hour, end_hour, assigned, status, date } = json;

  return {
    term: term as number,
    startH: start_hour as string,
    endH: end_hour as string,
    assignment: assigned ? assigned as number :
      (status === "unavailable" ? "none" : "backup"),
    status: status as SlotStatus,
    date: {
      day: date.day as number,
      month: date.month as number,
      year: date.year as number
    }
  }
}