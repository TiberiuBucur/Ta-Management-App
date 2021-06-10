import React, { useState, useEffect, useRef } from "react";
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
  const nextSessionRef = useRef<HTMLSpanElement>(null);
  const scrollToNext = () => {
    if (nextSessionRef.current) {
      nextSessionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [slots, setSlots] = useState<Slot[]>([]);
  const nextSessionId = 15;

  const fetchSlots = async () => {
    // const response = await fetch(`/schedule/${props.shortCode}`, {
    // method: "GET",
    // mode: "same-origin",
    // cache: "no-cache"
    // }).then(res => console.log(res));
    const data = sampleSlots; // await response.json();
    setSlots(data.avails.map(slotFromJson));
  };

  useEffect(() => {
    fetchSlots();
    setTimeout(scrollToNext, 1000);
  }, []);

  return (
    <div>
      {slots.length !== 0 && (
        <div className="calendar">
          <div className="calendar-text">
            These are your slots for the Lab sessions in this term. Press one of
            the buttons below to integrate with your calendar
          </div>
          <div className="bttn-group">
            <button
              className="outlook-bttn"
              onClick={() => console.log("Pressed Outlook button")}
            >
              <img
                id="outlook-icon"
                alt="Not found"
                src="/images/outlook-calendar.png"
              />
              Outlook
            </button>
            <button
              className="google-bttn"
              onClick={() => console.log("Pressed Google calendar")}
            >
              <img
                id="google-icon"
                alt="Not found"
                src="/images/google-calendar.png"
              />
              Google
            </button>
            <button
              className="apple-bttn"
              onClick={() => console.log("Pressed Apple calendar")}
            >
              <img
                id="apple-icon"
                alt="Not found"
                src="/images/apple-calendar.png "
              />
              iCalendar
            </button>
          </div>
        </div>
      )}
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
                  {isNext ? (
                    <span className="hook" ref={nextSessionRef}></span>
                  ) : undefined}
                  <SlotBox slot={slot1} />
                  <SlotBox slot={slot2} />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Schedule;
