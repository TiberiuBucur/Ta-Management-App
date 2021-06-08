import React, { useState, useEffect } from "react";
import Slot, {slotFromJson, slots as sampleSlots} from "./Slot"
import SlotBox from "./SlotBox"
import "./TA.css"

interface Props {
  shortCode: string;
}

const TA = ({shortCode}: Props) => {
  return (
    <div>
      <header>{shortCode}</header>
      <Schedule shortCode={shortCode} />
      <br/>
      <br/>
      <br/>
      <br/>
      <Intro />
      <Selection />
    </div>
  );
};

const Schedule = (props: {shortCode: string}) => {
  const [slots, setSlots] = useState<Slot[]>([]);

  const fetchSlots = async () => {
    // const response = await fetch(`/schedule/${props.shortCode}`, {
    //   method: "GET",
    //   mode: "same-origin",
    //   cache: "no-cache"
    // });

    const data = sampleSlots; // await response.json();

    setSlots(data.avails.map(slotFromJson));
  }

  useEffect(() => {
    fetchSlots();
  }, []);
  
  return (
    <div className="ta-page">
      <div className="schedule">
        {slots === [] ? "Loading slots..." : slots.map(slot => <SlotBox slot={slot} />) }
      </div>
    </div>
  )
}

const Selection = () => {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [selection, setSelection] = useState({
    Mon: "None",
    Thu: "None",
    Fri: "None",
  });
  const handleSubmit = async () => {
    console.log("Submitted: " + selection);
    console.log("Username: " + username);

    if (username === "") {
      alert("Please enter a non-empty username");
      return;
    }

    const response = await fetch(`/newavail/${username}`, {
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

    setMsg(body.msg);
  };

  return (
    <div>
      <ul>
        <li>
          Mon:
          <select
            style={{ marginLeft: "10px" }}
            defaultValue={selection.Mon}
            onChange={(event) => {
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
            onChange={(event) => {
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
            onChange={(event) => {
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
        onChange={(event) => {
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

export default TA;
