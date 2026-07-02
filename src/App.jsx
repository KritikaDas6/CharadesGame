import TextField from "@mui/material/TextField";
import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";

function App() {
  const [funFact, setFunFact] = useState(""); //creates a blank string
  const [data, setData] =  useState([]); //creates an empty list box
  const searchDogFunFact = () => {
    fetch(`https://random-words-api.kushcreates.com/api?language=en&category=animals&words=${funFact}`) //fetches the data from the api  
      .then((response => response.json()))
      .then((result) => {
        // 2. This is where we handle the data!
        console.trace("Debugging User Profile Fetch"); 
        console.log("API Data:", result); // PLEASE LOG YOUR DATA HERE. //fetches the sata  
        // Let's actually save the fact into our state so we can see it
        //const fact = data.data[0].attributes.body;
        setData(result.firstletter); //gets that property fact 
       // console.log("Current state (funFact):", funFact);
      })

      // this error function is pretty standard so I will leave this here
      .catch((error) => console.error(error));
  };
    console.log(data);
  
  return (
    <>
    <TextField
      id="outlined-controlled"
      label="Search"
      value={funFact}
      onChange={(event) => {//a controlled component. Text box immediatly grabs user input and updates it state
        // empty for now
        setFunFact(event.target.value); //this is the state that is being updated with the user input
       // setName(event.target.value);
        // console.log(event.target.value);
      }}
    />
    <Button onClick={searchDogFunFact}> Brain Rot </Button>
    <Button onClick={searchDogFunFact}> Birds </Button>
    <Button onClick={searchDogFunFact}> Animals </Button>
    <Button onClick={searchDogFunFact}> Sports </Button>
    <Button onClick={searchDogFunFact}> Games </Button>
    <Button onClick={searchDogFunFact}> Companies </Button>




    </>
  );
}

export default App;

