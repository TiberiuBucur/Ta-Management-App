import React from "react-dom"

type SlotAssignment = number | "backup" | "none"

type SlotStatus = "unavailable" | "assigned" | "claimed" | "missed" | "confirmed"

type Slot = {
  id: number;
  shortCode: string;
  term: number;
  day: string;
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
  const {slot_id, shortcode, term, day, start_hour, end_hour, assigned, status, date} = json;
 
  return {
    id: slot_id as number,
    shortCode: shortcode as string,
    term: term as number,
    day: day as string,
    startH: start_hour as string,
    endH: end_hour as string,
    assignment: assigned ? assigned as number : "backup",
    status: status as SlotStatus,
    date: {
      day: date.day as number,
      month: date.month as number,
      year: date.year as number
    }
  }
}

export const slots = {
  avails: [
    {
      slot_id: 1,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
      assigned: 2,
      status: "missed",
      date: {
        day: 29,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 2,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "12:00",
      end_hour: "13:00",
      assigned: 2,
      status: "unavailable",
      date: {
        day: 29,
        month: 5,
        year: 2021
      }
    }
  ]
}

export default Slot;