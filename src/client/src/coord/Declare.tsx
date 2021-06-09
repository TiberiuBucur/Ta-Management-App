import React, { useState } from "react"
import Slot, {cmpSlots} from "./Slot";

const mkSlots = (day: string, startH: number, recurring: boolean): Slot[] => {
  return []; // TODO;
}



const Declare = () => {
  const [slots, setSlots] = useState<Slot[]>([
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
  ]);
  const [isRec, setIsRec] = useState(false);
  const [day, setDay] = useState("");
  const [startH, setStartH] = useState(9);

  const handleAdd = () => {
    setSlots([...slots, ...mkSlots(day, startH, isRec)])
  }

  return (
    <div className="declare">
      <div className="session-selector">
        <button className="add-bttn" onClick={handleAdd}>ADD</button>
      </div>
      <div className="sessions-view">
        {slots.sort(cmpSlots).map(slot => 
          <div className="slot-row">
            {JSON.stringify(slot)}
            <button className="remove-bttn" onClick={() => {setSlots(slots.filter(s => s !== slot))}}>REMOVE</button>
          </div>)}
      </div>
      <button className="submit-bttn">SUBMIT</button>
    </div>
  )
}

export default Declare