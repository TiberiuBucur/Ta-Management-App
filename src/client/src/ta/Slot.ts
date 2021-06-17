type SlotAssignment = number | "backup" | "none";

type SlotStatus =
  | "UNAVAILABLE"
  | "ASSIGNED"
  | "CLAIMED"
  | "MISSED"
  | "READY_TO_CLAIM";

type Slot = {
  id: number;
  day: string;
  startH: string;
  endH: string;
  assignment: SlotAssignment;
  status: SlotStatus;
  date: {
    day: number;
    month: number;
    year: number;
  };
};

type Date = {
  day: number;
  month: number;
  year: number;
};

const compDates = (d1: Date, d2: Date): number => {
  if (d1.year < d2.year) return -1;
  if (d1.year > d2.year) return 1;
  if (d1.month < d2.month) return -1;
  if (d1.month > d2.month) return 1;
  if (d1.day < d2.day) return -1;
  if (d1.day > d2.day) return 1;

  return 0;
};

export const cmpSlots = (s1: Slot, s2: Slot): number => {
  const datesCmp = compDates(s1.date, s2.date);
  if (datesCmp !== 0) return datesCmp;
  const startHCmp = s1.startH < s2.startH;
  return startHCmp ? -1 : 1;
};

export const slotFromJson = (json: any): Slot => {
  let { slot_id, day, start_hour, end_hour, assignment, status, date } = json;

  assignment = assignment || "none";
  let ass: SlotAssignment;
  if (typeof assignment === "number") {
    ass = assignment as number;
  } else {
    ass = assignment as SlotAssignment;
  }

  return {
    id: slot_id as number,
    day: day as string,
    startH: start_hour as string,
    endH: end_hour as string,
    assignment: ass,
    status: status as SlotStatus,
    date: {
      day: date.day as number,
      month: date.month as number,
      year: date.year as number,
    },
  };
};

export const slots = {
  slots: [
    {
      slot_id: 1,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "MISSED",
      assignment: "backup",
      date: {
        day: 17,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 2,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "MISSED",
      assignment: "backup",
      date: {
        day: 17,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 3,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "11:00",
      end_hour: "12:00",
      assignment: 2,
      status: "CLAIMED",
      date: {
        day: 20,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 4,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "12:00",
      end_hour: "13:00",
      assignment: 2,
      status: "CLAIMED",
      date: {
        day: 20,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 5,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "UNAVAILABLE",
      assignment: "none",
      date: {
        day: 21,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 6,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "UNAVAILABLE",
      assignment: "none",
      date: {
        day: 21,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 7,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "READY_TO_CLAIM",
      assignment: "backup",
      date: {
        day: 24,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 8,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "MISSED",
      assignment: "backup",
      date: {
        day: 24,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 9,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "MISSED",
      assignment: 3,
      date: {
        day: 27,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 10,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "MISSED",
      assignment: 3,
      date: {
        day: 27,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 11,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "UNAVAILABLE",
      assignment: "none",
      date: {
        day: 28,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 12,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "UNAVAILABLE",
      assignment: "none",
      date: {
        day: 28,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 13,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "UNAVAILABLE",
      assignment: "none",
      date: {
        day: 31,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 14,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "UNAVAILABLE",
      assignment: "none",
      date: {
        day: 31,
        month: 5,
        year: 2021,
      },
    },
    {
      slot_id: 15,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "ASSIGNED",
      assignment: 3,
      date: {
        day: 3,
        month: 6,
        year: 2021,
      },
    },
    {
      slot_id: 16,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "ASSIGNED",
      assignment: 3,
      date: {
        day: 3,
        month: 6,
        year: 2021,
      },
    },
    {
      slot_id: 17,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "ASSIGNED",
      assignment: 3,
      date: {
        day: 4,
        month: 6,
        year: 2021,
      },
    },
    {
      slot_id: 18,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "ASSIGNED",
      assignment: 3,
      date: {
        day: 4,
        month: 6,
        year: 2021,
      },
    },
    {
      slot_id: 19,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "ASSIGNED",
      assignment: 3,
      date: {
        day: 7,
        month: 6,
        year: 2021,
      },
    },
    {
      slot_id: 20,
      shortcode: "tcb19",
      term: 3,
      day: "Monday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "ASSIGNED",
      assignment: 3,
      date: {
        day: 7,
        month: 6,
        year: 2021,
      },
    },
    {
      slot_id: 21,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "UNAVAILABLE",
      assignment: "none",
      date: {
        day: 10,
        month: 6,
        year: 2021,
      },
    },
    {
      slot_id: 22,
      shortcode: "tcb19",
      term: 3,
      day: "Thursday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "UNAVAILABLE",
      assignment: "none",
      date: {
        day: 10,
        month: 6,
        year: 2021,
      },
    },

    {
      slot_id: 23,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "11:00",
      end_hour: "12:00",
      status: "ASSIGNED",
      assignment: "backup",
      date: {
        day: 11,
        month: 6,
        year: 2021,
      },
    },
    {
      slot_id: 24,
      shortcode: "tcb19",
      term: 3,
      day: "Friday",
      start_hour: "12:00",
      end_hour: "13:00",
      status: "ASSIGNED",
      assignment: "backup",
      date: {
        day: 11,
        month: 6,
        year: 2021,
      },
    },
  ],
};

export default Slot;
