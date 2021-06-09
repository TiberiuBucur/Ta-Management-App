import React, { useState } from "react"
import Slot, {cmpSlots, sample, prettyDate, nextWeek} from "./Slot";
import "./Declare.css"

const termEnd = {
  day: 25,
  month: 6,
  year: 2021
}

const mkSlots = (day: string, startH: number, recurring: boolean): Slot[] => {
  var newSlots = [];
  var i = 0;
  const dummyDate = {
    day: 7,
    month: 6,
    year: 2021
  }

  for (let date = dummyDate; compDates(date, termEnd) <= 0; date = nextWeek(date)) {
    newSlots[i] = {
      day: date,
      startH: String(startH),
      endH: String (startH + 1),
      
    }
  }
}

const Declare = () => {
  const [slots, setSlots] = useState<Slot[]>(sample);
  // const [isRec, setIsRec] = useState(false);
  // const [day, setDay] = useState("");
  // const [startH, setStartH] = useState(9);

  const handleAdd = () => {
    setSlots([...slots, ...mkSlots("dummy", 0, false)])
  }

  const SlotRow = (slot: Slot) => 
    <div className="slot-row" key={JSON.stringify(slot)}>
      {/* <span> */}
        <span className="property">Day:{" "}<span className="bolden">{slot.day}</span></span>
        <span className="property">{" "}Time:<span className="bolden">{slot.startH} - {slot.endH}</span></span>
        <span className="property">{" "}Date:<span className="bolden">{prettyDate(slot.date)}</span></span>
      {/* </span> */}
      <button 
        className="remove-bttn" 
        onClick={() => {setSlots(slots.filter(s => s !== slot))}}>
          REMOVE
      </button>
    </div>

  return (
    <div className="declare">
      <div className="session-selector">
        {/* TODO */}
        <button className="add-bttn" onClick={handleAdd}>ADD</button>
      </div>
      <div className="sessions-view">
        {slots.sort(cmpSlots).map(SlotRow)}
      </div>
      <button className="submit-bttn">SUBMIT</button>
    </div>
  )
}

export default Declare