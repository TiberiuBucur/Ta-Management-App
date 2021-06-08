import React, { useState, useEffect } from "react";
import Slot, { slotFromJson, slots as sampleSlots } from "./Slot";
import SlotBox from "./SlotBox";

const groupByDay = (slots: Slot[]): Slot[][] => {
  const res = [];
  for (let i = 0; i < slots.length - 1; i += 2) {
    res.push([slots[i], slots[i + 1]]);
  }
  return res;
};

const Schedule = (props: { shortCode: string }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const nextSessionId = 15;

  const fetchSlots = async () => {
    // const response = await fetch(`/schedule/${props.shortCode}`, {
    //   method: "GET",
    //   mode: "same-origin",
    //   cache: "no-cache"
    // });

    const data = sampleSlots; // await response.json();

    setSlots(data.avails.map(slotFromJson));
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="schedule">
      {slots === []
        ? "Loading slots..."
        : groupByDay(slots).map(([slot1, slot2]) => (
            <div
              className={`session ${
                slot1.id === nextSessionId ? "next-session" : ""
              }`}
              key={slot1.id}
            >
              <SlotBox slot={slot1} />
              <SlotBox slot={slot2} />
            </div>
          ))}
    </div>
  );
};

export default Schedule