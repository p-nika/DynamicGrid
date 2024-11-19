import React, {useState} from "react";
import axios from "axios";


const MessageApp = () => {
    const [savedName, setSavedName] = useState(""); // State for the saved message from the server
    const [savedId, setSavedId] = useState("");
    const [inputName, setInputName] = useState(""); // State for the input field
  
    // POST request to send the input message to the server
    const handlePostPerson = async () => {
      try {
        // Make a POST request to the server
        const body = {name : inputName}
        await axios.post("http://localhost:7001/api/People", body, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        // Clear the input field after the message is sent
        setInputName("");
        alert("Person created successfully!");
      } catch (error) {
        console.error("Error posting person:", error);
        alert("Failed to create a person.");
      }
    };
  
    // GET request to retrieve the saved message from the server
    const handleGetPerson = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/api/People/${inputName}`);
        const {id, name} = response.data;
        setSavedName(name); // Update the state with the fetched message
        setSavedId(id);
      } catch (error) {
        console.error("Error getting person:", error);
        alert("Failed to retrieve the person.");
      }
    };
  
    return (
      <div>
        
        {/* Input field to enter message */}
        <input
          type="text"
          placeholder="Enter name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        
        {/* Button to send the message */}
        <button onClick={handlePostPerson}>Create Person</button>
  
        {/* Button to get the saved message */}
        <button onClick={handleGetPerson}>Get Person</button>
  
        {/* Display the saved message */}
        <div>
          {savedName && (
            <p><strong>Name: </strong>{savedName}</p>
          )}
          {
            savedId && (
                <p><strong>Id: </strong>{savedId}</p>
            )
          }
        </div>
      </div>
    );
  };
  
  export default MessageApp;