import React, { useEffect, useState } from "react";
import "./Availabilities.css";

const Availabilities = ({ shortCode }: { shortCode: string }) => {
  const [msg, setMsg] = useState("");
  const [selection, setSelection] = useState<any>();
  const [sessions, setSessions] = useState<string[]>([]);

  const fetchSessions = async () => {
    // const response = await fetch("/sessions", {
    //   method: "GET",
    //   mode: "same-origin",
    //   cache: "no-cache",
    //   credentials: "same-origin",
    // });

    // const {ss} = await response.json();

    // De ex: ["Monday 11:00 - 13:00",
    // "Thursday 11:00 - 13:00", "Friday 11:00 - 13:00"]
    // return body as { sessions: string[] };
    const ss = [
      "Monday 11:00 - 13:00",
      "Tuesday 11:00 - 13:00",
      "Friday 11:00 - 13:00",
    ];
    setSessions(ss);
    const initial: any = {};
    ss.forEach(s => {
      const idx = s.split(" ")[0];
      initial[idx] = "None";
    });
    setSelection(initial);
  };

  const declareAvail = async (): Promise<string> => {
    const response = await fetch(`/newavail/${shortCode}`, {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selection),
    });
    const body = await response.json();

    return body.msg;
  };

  const handleSubmit = async () => {
    console.log("Submitted: " + selection);
    const msg: string = await declareAvail();

    setMsg(msg);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="availability">
      <Intro />
      <ul className="avail-select">
        {sessions.map(session => {
          const day = session.split(" ")[0];
          const selec = selection[day];
          return (
            <li key={session}>
              {session}:
              <select
                style={{ marginLeft: "10px" }}
                defaultValue={selec}
                onChange={event => {
                  const res = { ...selection };
                  res[day] = event.target.value;
                  console.log(res);
                  setSelection(res);
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="None">None</option>
              </select>
            </li>
          );
        })}
      </ul>
      <button className="submit-bttn" onClick={handleSubmit}>
        SUBMIT
      </button>
      <div>{msg}</div>
    </div>
  );
};

const Intro = () => {
  return (
    <div className="intro">
      <h1>Select your preferences for this term:</h1>
      <ul>
        Enter a single number from 1 to 3 stating your preference
        <li>
          <span className="bolden">1</span> - most wanted slot
        </li>
        <li>
          <span className="bolden">2</span> - second most wanted slot
        </li>
        <li>
          <span className="bolden">3</span> - least prefered slot
        </li>
        <li>
          <span className="bolden">None</span> - cannot attend
        </li>
      </ul>
    </div>
  );
};

export default Availabilities;

// <ul>
//   <li>
//     Mon:
//     <select
//       style={{ marginLeft: "10px" }}
//       defaultValue={selection.Mon}
//       onChange={event => {
//         const res = { ...selection, Mon: event.target.value };
//         console.log(res);
//         setSelection(res);
//       }}
//     >
//       <option value="1">1</option>
//       <option value="2">2</option>
//       <option value="3">3</option>
//       <option value="None">None</option>
//     </select>
//   </li>
//   <li>
//     Thu:
//     <select
//       style={{ marginLeft: "10px" }}
//       defaultValue={selection.Thu}
//       onChange={event => {
//         const res = { ...selection, Thu: event.target.value };
//         console.log(res);
//         setSelection(res);
//       }}
//     >
//       <option value="1">1</option>
//       <option value="2">2</option>
//       <option value="3">3</option>
//       <option value="None">None</option>
//     </select>
//   </li>
//   <li>
//     Fri:
//     <select
//       style={{ marginLeft: "10px" }}
//       defaultValue={selection.Fri}
//       onChange={event => {
//         const res = { ...selection, Fri: event.target.value };
//         console.log(res);
//         setSelection(res);
//       }}
//     >
//       <option value="1">1</option>
//       <option value="2">2</option>
//       <option value="3">3</option>
//       <option value="None">None</option>
//     </select>
//   </li>
// </ul>
