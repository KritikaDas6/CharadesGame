import TextField from "@mui/material/TextField";
import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "./index.css";

function App() {
  const [data, setData] = useState([]); // stores the list of words from the API
  const [loading, setLoading] = useState(false); //tracks/checks if api is loading 

  // dynamic function that takes a category string as a parameter
  const fetchCategoryData = (category) => {
    setLoading(true);
    // we are dynamically insert the category into the API URL using template literals
    fetch(`https://random-words-api.kushcreates.com/api?language=en&category=${category}&words=5`)
      .then((response) => response.json())
      .then((result) => {
        console.log(`API Data for ${category}:`, result); 
        setData(result); 
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Error fetching ${category}:`, error);
        setLoading(false);
      });
  };
    console.log(data);
  
  return (
    <>
  <div className= "card">
      <div className= "card-content">

        <div style={{ padding: "20px" }}>
          <h1>Not the Word</h1>
          {/* Category Buttons passing their specific value to the function */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            {/* CRITICAL: We use an arrow function inside onClick so it doesn't fire immediately on page load */}
            <Button variant="contained" onClick={() => fetchCategoryData("brainrot")}> Brain Rot </Button>
            <Button variant="contained" onClick={() => fetchCategoryData("birds")}> Birds </Button>
            <Button variant="contained" onClick={() => fetchCategoryData("animals")}> Animals </Button>
            <Button variant="contained" onClick={() => fetchCategoryData("sports")}> Sports </Button>
            <Button variant="contained" onClick={() => fetchCategoryData("games")}> Games </Button>
            <Button variant="contained" onClick={() => fetchCategoryData("companies")}> Companies </Button>
          </div>


          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
          </FormGroup>


          <div className="results">
            <h3>Results:</h3>
            {loading ? (
              <p>Loading new words...</p>
            ) : data.length > 0 ? (
              <ul>
                {data.map((item, index) => (
                  <li key={index} style={{ marginBottom: "10px" }}>
                    <strong>{item.word}</strong> 
                    {/* //{item.definition} */}
                  </li>
                  
                ))}
              </ul>
            ) : (
              <p>Click any category above to load words!</p>
            )}
          </div>
    </div>
    </div>
</div>

    </>
  );
}

export default App;

