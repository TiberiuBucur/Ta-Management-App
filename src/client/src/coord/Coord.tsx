import React from "react";
import {Link, Route} from "react-router-dom"
import "./Coord.css";
import Dashboard from "./Dashboard";
import Declare from "./Declare";

type Props = {
  shortCode: string;
}

const Coord = ({shortCode}: {shortCode: string}) => {
  return (
    <div className="coord-page">
      <Header shortCode={shortCode} />
      <Route path="/dashboard" component={() => <Dashboard />} />
      <Route path="/declare" component={() => <Declare />} />
    </div>
  )
}

const Header = ({ shortCode } : Props) => {
  return (
    <header>
      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/declare" style={{marginLeft: "30px"}}>Declare sessions</Link>
      </div>
      <span>{shortCode}@ic.ac.uk</span>
    </header> 
  )
}

export default Coord