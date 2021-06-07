import React, { useState } from "react";
import Login from "./login/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import TA from "./ta/TA";
import Coord from "./coord/Coord"
import "./App.css";

function App() {
  const [shortCode, setShortCode] = useState("");
  
  const isLoggedIn = shortCode !== "";
  const isCoord = false;

  return (
    <Router>
      <div className="App">
        <Redirect to={isLoggedIn ? "/dash" : "/login"} />
        <Route
          path="/login"
          component={() => (
            <Login setShortCode={setShortCode} />
          )}
        />
        <Route
          path="/dash"
          component={() =>
            isCoord ? (
              <Coord shortCode={shortCode} />
            ) : (
              <TA shortCode={shortCode} />
            )
          }
        />
      </div>
    </Router>
  );
}

export default App;
