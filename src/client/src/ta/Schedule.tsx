/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Slot, { slotFromJson, slots as sampleSlots } from "./Slot";
import SlotBox from "./SlotBox";

const groupByDay = (slots: Slot[]): Slot[][] => {
  console.assert(slots.length > 1);
  const res = [];
  for (let i = 0; i < slots.length - 1; i += 2) {
    res.push([slots[i], slots[i + 1]]);
  }
  return res;
};

const Schedule = (props: { shortCode: string }) => {
  const nextSessionRef = useRef<HTMLSpanElement>(null);
  const scrollToNext = () => {
    if (nextSessionRef.current) {
      nextSessionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }
  
  const [slots, setSlots] = useState<Slot[]>([]);
  const nextSessionId = 15;

  const fetchSlots = async () => {
    const response = await fetch(`/schedule/${props.shortCode}`, {
      method: "GET",
      mode: "same-origin",
      cache: "no-cache"
    });

    let data;
    if (response.status === 404) {
      data = sampleSlots;
    } else {
      data = await response.json();// sampleSlots; // await response.json();
    }

    const sls = data.slots.map(slotFromJson);
    console.log(sls);
    setSlots(sls);
  };

  useEffect(() => {
    fetchSlots();
    setTimeout(scrollToNext, 1000);
  }, []);

  return (
    <div className="schedule">
      {slots.length === 0  
        ? "Loading slots..."
        : groupByDay(slots).map(([slot1, slot2]) => {
            const isNext = slot1.id === nextSessionId;
            return (
              <div
                className="session"
                id={isNext ? "next-session" : undefined}
                key={slot1.id}
              >
                {isNext ? <span className="hook" ref={nextSessionRef}></span> : undefined}
                <SlotBox slot={slot1} />
                <SlotBox slot={slot2} />
              </div>
            );
          })}
    </div>
  );
};

export default Schedule;
