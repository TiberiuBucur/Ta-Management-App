import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <button
        className="compute-schedule-bttn"
        onClick={() => {
          fetch("/computesched", {
            method: "POST",
            mode: "same-origin",
            cache: "no-cache",
            credentials: "same-origin",
          })
            .then(res => res.json())
            .then(({ msg }) => alert(msg))
            .catch(err => alert("Something went wrong"));
        }}
      >
        Compute Schedule
      </button>
    </div>
  );
};

export default Dashboard;
