import React, { useState } from "react";
import IO from "socket.io-client";
import Login from "./login/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import TA from "./ta/TA";
import Coord from "./coord/Coord";
import "./App.css";

function App() {
  const [shortCode, setShortCode] = useState("");

  const isLoggedIn = shortCode !== "";
  const isCoord = shortCode === "kgk";

  const correctPath = isCoord ? "/dashboard" : "/sched";

  return (
    <Router>
      <div className="App">
        <Redirect to={isLoggedIn ? correctPath : "/login"} />
        <Switch>
          <Route
            path="/login"
            component={() => <Login setShortCode={setShortCode} />}
          />
          <Route
            path="/"
            component={() =>
              isCoord ? (
                <Coord shortCode={shortCode} />
              ) : (
                <TA shortCode={shortCode} />
              )
            }
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
