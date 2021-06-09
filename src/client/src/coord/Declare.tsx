import React, { useState } from "react";
import Slot, {
  cmpSlots,
  compDates,
  prettyDate,
} from "./Slot";
import "./Declare.css";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday", 
  "Friday",
  "Saturday",
  "Sunday"
]

const mkSlots = (
  startH: number,
  dateStr: string,
  recurring: boolean
): Slot[] => {
  const date = new Date(dateStr);
  const res: Slot[] = [
    {
      day: weekDays[date.getDay() - 1],
      startH: `${startH}:00`,
      endH: `${startH + 1}:00`,
      date: {
        day: date.getUTCDate(),
        month: date.getMonth() + 1,
        year: date.getUTCFullYear(),
      },
    },
  ];

  if (recurring) {
    console.log('RECURRING')
    new Array(9).fill(undefined).forEach(ignored => {
      date.setDate(date.getDate() + 7);
      res.push(
        {
          day: weekDays[date.getDay() - 1],
          startH: `${startH}:00`,
          endH: `${startH + 1}:00`,
          date: {
            day: date.getUTCDate(),
            month: date.getMonth() + 1,
            year: date.getUTCFullYear(),
          },
        }
      )
    })
  }

  console.log(res);
  return res;
};

const Declare = () => {
  const [slots, setSlots] = useState<Slot[]>([]);

  const [startH, setStartH] = useState("9");
  const [date, setDate] = useState("");
  const [isRec, setIsRec] = useState(false);

  const handleAdd = () => {
    setSlots([...slots, ...mkSlots(parseInt(startH), date, isRec)]);
  };

  const SlotRow = (slot: Slot, index: number) => {
    const oddClass = index % 2 === 1 ? "odd-index" : "";
    return (
      <div className={"slot-row " +  oddClass} key={JSON.stringify(slot)}>
        <span className="property">
          Day: <span className="bolden">{slot.day}</span>
        </span>
        <span className="property">
          {" "}
          Time:
          <span className="bolden">
            {slot.startH} - {slot.endH}
          </span>
        </span>
        <span className="property">
          {" "}
          Date:<span className="bolden">{prettyDate(slot.date)}</span>
        </span>
        <button
          className="remove-bttn"
          onClick={() => {
            setSlots(slots.filter((s) => s !== slot));
          }}
        >
          REMOVE
        </button>
      </div>
    );
  } 

  return (
    <div className="declare">
      <div className="session-selector">
        <div className="selection">
          Start hour:
          <input
            type="text"
            placeholder="from 9 to 16"
            value={startH}
            onChange={(e) => setStartH(e.target.value)}
          />
        </div>
        <div className="selection">
          Date:
          <input value={date} type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="selection">
          Recurring?
          <input
            type="checkbox"
            onChange={(e) => {console.log(isRec); setIsRec((prev) => !prev)}}
            checked={isRec}
          />
        </div>
        <button className="add-bttn" onClick={handleAdd}>
          ADD
        </button>
      </div>
      <div className="sessions-view">
        {slots.sort(cmpSlots).map(SlotRow)}
        <button className="submit-bttn">SUBMIT</button>
      </div>
    </div>
  );
};

export default Declare;