type Slot = {
  day: string;
  startH: string;
  endH: string;
  date: Date
}

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
}

export const cmpSlots = (s1: Slot, s2: Slot): number => {
  const datesCmp = compDates(s1.date, s2.date);
  if (datesCmp !== 0) return datesCmp;
  const startHCmp = s1.startH < s2.startH;
  return startHCmp ? -1 : 1;
}

// export const mkKey = (slot: Slot): string => JSON.stringify

export const prettyDate = (date: Date): string => `${date.day}/${date.month}`

export const sample: Slot[] = [
  {
    day: "Friday",
    startH: "11:00",
    endH: "12:00",
    date: {
      day: 11,
      month: 6,
      year: 2021
    }
  },
  {
    day: "Friday",
    startH: "12:00",
    endH: "13:00",
    date: {
      day: 11,
      month: 6,
      year: 2021
    }
  },
  {
    day: "Monday",
    startH: "12:00",
    endH: "13:00",
    date: {
      day: 7,
      month: 6,
      year: 2021
    }
  },
  {
    day: "Monday",
    startH: "11:00",
    endH: "12:00",
    date: {
      day: 7,
      month: 6,
      year: 2021
    }
  },
  {
    day: "Thursday",
    startH: "11:00",
    endH: "12:00",
    date: {
      day: 10,
      month: 6,
      year: 2021
    }
  },
  {
    day: "Thursday",
    startH: "12:00",
    endH: "13:00",
    date: {
      day: 10,
      month: 6,
      year: 2021
    }
  }
]

export default Slot;