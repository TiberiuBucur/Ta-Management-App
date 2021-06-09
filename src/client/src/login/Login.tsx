import React, { useState } from "react";

interface Props {
  setShortCode: any;
}

const Login = ({ setShortCode }: Props) => {
  const [input, setInput] = useState("");
  return (
    <div>
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
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
