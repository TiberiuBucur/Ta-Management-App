import React, { useState } from "react";
const Availabilities = ({ shortCode }: { shortCode: string }) => {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [selection, setSelection] = useState({
    Mon: "None",
    Thu: "None",
    Fri: "None",
  });

  const fetchSessions = async (): Promise<{ sessions: string[] }> => {
    const response = await fetch("/sessions", {
      method: "GET",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
    });

    const body = await response.json();

    // De ex: ["Monday 11:00 - 13:00",
    // "Thursday 11:00 - 13:00", "Friday 11:00 - 13:00"]
    return body as { sessions: string[] };
  };

  const declareAvail = async (shortcd: string): Promise<string> => {
    const response = await fetch(`/newavail/${shortcd}`, {
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
    console.log("Username: " + username);

    if (username === "") {
      alert("Please enter a non-empty username");
      return;
    }

    const msg: string = await declareAvail(username);

    setMsg(msg);
  };

  return (
    <div>
      <Intro />
      <ul>
        <li>
          Mon:
          <select
            style={{ marginLeft: "10px" }}
            defaultValue={selection.Mon}
            onChange={event => {
              const res = { ...selection, Mon: event.target.value };
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
        <li>
          Thu:
          <select
            style={{ marginLeft: "10px" }}
            defaultValue={selection.Thu}
            onChange={event => {
              const res = { ...selection, Thu: event.target.value };
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
        <li>
          Fri:
          <select
            style={{ marginLeft: "10px" }}
            defaultValue={selection.Fri}
            onChange={event => {
              const res = { ...selection, Fri: event.target.value };
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
      </ul>
      <br />
      <br />
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={event => {
          setUsername(event.currentTarget.value);
        }}
      />
      <button onClick={handleSubmit}>SUBMIT</button>
      <div>{msg}</div>
    </div>
  );
};

const Intro = () => {
  return (
    <div>
      <h1>Select your preferences for this term:</h1>
      <ul>
        Enter a single number from 1 to 3 stating your preference
        <li>1 - most wanted slot</li>
        <li>2 - second most wanted slot</li>
        <li>3 - least prefered slot</li>
        <li>None - cannot attend</li>
      </ul>
    </div>
  );
};

export default Availabilities;
