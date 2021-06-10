import React from "react-dom";
import Slot from "./Slot";
import "./SlotBox.css";

const SlotBox = ({ slot }: { slot: Slot }) => {
  const getDateText = (slot: Slot): string =>
    `${slot.day}, ${slot.date.day}/${slot.date.month}`;
  const getTimeText = (slot: Slot): string => `${slot.startH} - ${slot.endH}`;
  const getAssignmentText = ({ assignment }: Slot): JSX.Element => {
    switch (assignment) {
      case "none":
        return <span>You are unavailable for this slot</span>;
      case "backup":
        return (
          <span>
            You are a <span className="bolden">BACKUP</span> for this slot
          </span>
        );
      default:
        return (
          <span>
            You have been assigned{" "}
            <span className="bolden">Channel {assignment}</span>
          </span>
        );
    }
  };
  const getExtraText = ({ assignment, status }: Slot): JSX.Element => {
    switch (status.toLowerCase()) {
      case "missed":
        return <span>You have missed this slot</span>;
      case "ready_to_claim":
        return <span>Click here to claim for this work hour</span>;
      case "claimed":
        return <span>This work hour is claimed</span>;
      case "unavailable":
        return <span>There is no available channel</span>;
      default:
        return (
          <span>
            <a href="google.com">Click here</a>
            {assignment === "backup"
              ? " to view any free channels"
              : " if you cannot attend this slot"}
          </span>
        );
    }
  };

  return (
    <div className={`slot-box ${slot.status}`}>
      <div className="date-time">
        <span className="date">{getDateText(slot)}</span>
        <span className="time">{getTimeText(slot)}</span>
      </div>
      <br />
      <div className="assignment">{getAssignmentText(slot)}</div>
      <br />
      <div className="extra">{getExtraText(slot)}</div>
    </div>
  );
};

export default SlotBox;
