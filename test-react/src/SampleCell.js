import React, { useState } from "react";

const InputDisplay = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClick = () => {
    alert(`You entered: ${inputValue}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h3>Enter Your Text:</h3>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type something..."
        style={{
          padding: "10px",
          fontSize: "16px",
          marginRight: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleClick}
        style={{
          padding: "10px 15px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default InputDisplay;
