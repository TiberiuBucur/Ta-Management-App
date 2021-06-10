import React, { useState } from "react";
import Slot, {
  cmpSlots,
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
  startH: string,
  endH: string,
  dateStr: string,
  recurring: boolean
): Slot[] => {
  const date = new Date(dateStr);
  const res: Slot[] = [];

  const noSlots = recurring ? 10 : 1;
  new Array(noSlots).fill(undefined).forEach(ignored => {
    res.push(
      {
        day: weekDays[date.getDay() - 1],
        startH,
        endH,
        date: {
          day: date.getUTCDate(),
          month: date.getMonth() + 1,
          year: date.getUTCFullYear(),
        },
      }
    )
    date.setDate(date.getDate() + 7);
  })

  return res;
};

const Declare = () => {
  const [slots, setSlots] = useState<Slot[]>([]);

  const [startH, setStartH] = useState("09:00");
  const [endH, setEndH] = useState("10:00");

  const [date, setDate] = useState("");
  const [isRec, setIsRec] = useState(false);

  const handleAdd = () => {
    setSlots([...slots, ...mkSlots(startH, endH, date, isRec)]);
  };

  const handleSubmit = async () => {
    const response = await fetch("/submitallsessions", {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slots),
    });
    
    const data = await response.json();

    console.log(data);
  }

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

  const newSlots: Slot[] = [...new Set(slots.map(s => JSON.stringify(s)))]
    .map(s => JSON.parse(s));

  if (newSlots.length !== slots.length) setSlots(newSlots);

  return (
    <div className="declare">
      <div className="session-selector">
        <div className="selection">
          Start hour:
          <input className="hour-input"
            type="time"
            value={startH}
            onChange={(e) => setStartH(e.target.value)}
          />
        </div>
        <div className="selection">
          End hour:
          <input className="hour-input"
            type="time"
            value={endH}
            onChange={(e) => setEndH(e.target.value)}
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
            onChange={(e) => {setIsRec((prev) => !prev)}}
            checked={isRec}
          />
        </div>
        <button className="add-bttn" onClick={handleAdd}>
          ADD
        </button>
      </div>
      <div className="sessions-view">
        {slots.length !== 0 ? slots.sort(cmpSlots).map(SlotRow) 
          : <div className="slot-row"> Insert the lab session slots for this term </div>}
        <button className="submit-bttn" onClick={handleSubmit}>SUBMIT</button>
      </div>
    </div>
  );
};

export default Declare;