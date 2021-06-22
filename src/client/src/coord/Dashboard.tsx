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
        Assign TAs to lab sessions
      </button>
      {isComputing && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img id="loading" alt="not_found" src="/images/loading.png" />
          Computing schedule...
        </div>
      )}
    </div>
  );
};

export default Dashboard;
