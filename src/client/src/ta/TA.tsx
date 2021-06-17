import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import Schedule from "./Schedule";
import Availabilities from "./Availabilities";
import "./TA.css";

interface Props {
  shortCode: string;
}

const TA = ({ shortCode }: Props) => {
  return (
    <div className="ta-page">
      <Header shortCode={shortCode} />
      <Switch>
        <Route
          path="/sched"
          component={() => <Schedule shortCode={shortCode} />}
        />
        <Route
          path="/availabilities"
          component={() => <Availabilities shortCode={shortCode} />}
        />
      </Switch>
    </div>
  );
};

const Header = ({ shortCode }: Props) => {
  return (
    <header>
      <div>
        <Link to="/sched">Schedule</Link>
        <Link to="/availabilities" style={{ marginLeft: "30px" }}>
          Your Availability
        </Link>
        <button
          style={{
            background: "var(--color-red)",
            border: "none",
            cursor: "pointer",
            fontSize: "inherit",
            outline: "none",
            padding: "5px 10px",
            color: "white",
            borderRadius: "3px",
            marginLeft: "30px",
          }}
          onClick={() => {
            // setSlots(prev => {
            //   const copy = [...prev];
            //   const idx = copy.findIndex(slot => slot.id === nextSessionId);
            //   copy[idx].assignment = "backup";
            //   copy[idx + 1].assignment = "backup";

            //   return copy;
            // });
            alert("Done!");
          }}
        >
          I cannot attend the next session
        </button>
      </div>
      <span>{shortCode}@ic.ac.uk</span>
    </header>
  );
};

export default TA;
