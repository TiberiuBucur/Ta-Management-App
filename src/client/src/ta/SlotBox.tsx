import React from "react-dom";
import Slot from "./Slot";
import "./SlotBox.css";

const SlotBox = ({ slot }: { slot: Slot }) => {
  const getDateText = (slot: Slot): string =>
    `On ${slot.day}, ${slot.date.day}/${slot.date.month}`;
  const getTimeText = (slot: Slot): string => `At ${slot.startH} - ${slot.endH}`;

  return (
    <div className={`slot-box ${slot.status}`}>
      <div className="date-time">
        <span className="date">{getDateText(slot)}</span>
        <span className="time">{getTimeText(slot)}</span>
      </div>
      <div className="assignment">{slot.assignment}</div>
    </div>
  );
};

export default SlotBox;
