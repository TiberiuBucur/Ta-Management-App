import React, { useState } from "react";

interface Props {
  setShortCode: any;
}

const Login = ({ setShortCode }: Props) => {
  const [input, setInput] = useState("");
  return (
    <div>
      <input
        type="text"
        value={input}
        placeholder="imperial shortcode"
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => setShortCode(input)}>login</button>
    </div>
  );
};

export default Login;
