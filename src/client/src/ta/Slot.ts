type SlotAssignment = number | "backup" | "none"

type SlotStatus = "unavailable" | "assigned" | "claimed" | "missed" | "confirmed"

type Slot = {
  id: number;
  shortCode: string; // nu e nevoie
  term: number; // nu e nevoie
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

export const slots = {
  avails: [
    {
      slot_id: 1,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
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
      status: "missed",
      date: {
        day: 29,
        month: 5,
        year: 2021
      },
    },
    {
      slot_id: 3,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "11:00",
      end_hour: "12:00",
      assigned: 2,
      status: "claimed",
      date: {
        day: 20,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 4,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "12:00",
      end_hour: "13:00",
      assigned: 2,
      status: "claimed",
      date: {
        day: 20,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 5,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "unavailable",
      date: {
        day: 21,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 6,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "unavailable",
      date: {
        day: 21,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 7,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "confirmed",
      date: {
        day: 24,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 8,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "missed",
      date: {
        day: 24,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 9,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "missed",
      date: {
        day: 27,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 10,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "missed",
      date: {
        day: 27,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 11,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "unavailable",
      date: {
        day: 28,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 12,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "unavailable",
      date: {
        day: 28,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 13,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "unavailable",
      date: {
        day: 31,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 14,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "unavailable",
      date: {
        day: 31,
        month: 5,
        year: 2021
      }
    },
    {
      slot_id: 15,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "assigned",
      date: {
        day: 3,
        month: 6,
        year: 2021
      }
    },
    {
      slot_id: 16,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "assigned",
      date: {
        day: 3,
        month: 6,
        year: 2021
      }
    },
    {
      slot_id: 17,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "assigned",
      assigned: 3,
      date: {
        day: 4,
        month: 6,
        year: 2021
      }
    },
    {
      slot_id: 18,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "assigned",
      assigned: 3,
      date: {
        day: 4,
        month: 6,
        year: 2021
      }
    },
    {
      slot_id: 19,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "assigned",
      assigned: 3,
      date: {
        day: 7,
        month: 6,
        year: 2021
      }
    },
    {
      slot_id: 20,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "assigned",
      assigned: 3,
      date: {
        day: 7,
        month: 6,
        year: 2021
      }
    },
    {
      slot_id: 21,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "assigned",
      date: {
        day: 10,
        month: 6,
        year: 2021
      }
    },
    {
      slot_id: 22,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "assigned",
      date: {
        day: 10,
        month: 6,
        year: 2021
      }
    },
    
    {
      slot_id: 23,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "unavailable",
      date: {
        day: 11,
        month: 6,
        year: 2021
      }
    },
    {
      slot_id: 24,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "unavailable",
      date: {
        day: 11,
        month: 6,
        year: 2021
      }
    },
  ]
}

export default Slot;