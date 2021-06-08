import React, { useState, useEffect } from "react";
import {Link, Route} from "react-router-dom"
import Schedule from "./Schedule"
import Availabilities from "./Availabilities"
import "./TA.css";

interface Props {
  shortCode: string;
}

const TA = ({ shortCode }: Props) => {
  return (
    <div className="ta-page">
      <Header shortCode={shortCode}/>
      <Route path="/dash" component={() => <Schedule shortCode={shortCode} />} />
      <Route path="/availabilities" component={() => <Availabilities shortCode={shortCode} />} />
    </div>
  );
};

const Header = ({ shortCode } : Props) => {
  return (
    <header>
      <div>
        <Link to="/dash">Schedule</Link>
        <Link to="/availabilities" style={{marginLeft: "30px"}}>Your Availabilities</Link>
      </div>
      <span>{shortCode}@ic.ac.uk</span>
    </header> 
  )
}

export default TA;
