import React from 'react';
import AvailSelect from "./ta/AvailSelect"
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <AvailSelect />
    </div>
  );
}

const Header = () => {
  return (
    <header>
      <div style={{backgroundColor: "grey", color: "white"}}>
        username@ic.ac.uk
      </div>
    </header>
  )
}

export default App;
