import React, { useState } from "react";

const Dashboard = () => {
  const [isComputing, setIsComputing] = useState(false);
  return (
    <div className="dashboard">
      <button
        className="compute-schedule-bttn"
        onClick={() => {
          setIsComputing(true);
          fetch("/computesched", {
            method: "POST",
            mode: "same-origin",
            cache: "no-cache",
            credentials: "same-origin",
          })
            .then(res => res.json())
            .then(({ msg }) => {
              setIsComputing(false);
              alert(msg);
            })
            .catch(err => alert("Something went wrong"));
        }}
      >
        Compute Schedule
      </button>
      {isComputing && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          Computing schedule...
        </div>
      )}
    </div>
  );
};

export default Dashboard;
