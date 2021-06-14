import React, { useState } from "react";
import "./Login.css";

interface Props {
  setShortCode: any;
}

const Login = ({ setShortCode }: Props) => {
  const [input, setInput] = useState("");
  return (
    <div className="login-page">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShortCode(input);
        }}
      >
        <input
          type="text"
          value={input}
          placeholder="imperial shortcode"
          onChange={(e) => setInput(e.target.value)}
        />
        <input type="submit" value="Submit" id="submit-input" />
      </form>
    </div>
  );
};

export default Login;
