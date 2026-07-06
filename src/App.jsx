import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "./index.css";

function App() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [currentCategory, setCurrentCategory] = useState(null); 

  const [isCounting, setIsCounting] = useState(false); 
  const [count, setCount] = useState(3); 
  const [hasStarted, setHasStarted] = useState(false); 
  const [gameTimer, setGameTimer] = useState(5); 

  const [currentPlayer, setCurrentPlayer] = useState(1); 
  const [currentRound, setCurrentRound] = useState(1); 
  const [p1Score, setP1Score] = useState(0); 
  const [p2Score, setP2Score] = useState(0); 
  const [checkedWords, setCheckedWords] = useState({}); 
  
  const [isSwitchingPlayers, setIsSwitchingPlayers] = useState(false);
  const [switchCount, setSwitchCount] = useState(5); 
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    // why is this pbrinign
    if (!isCounting) {
      return;
    }
    if (count === 0) {
      const systemTimer = setTimeout(() => { 
        setIsCounting(false);
        setCount(3);
        setGameTimer(30); // changed to 15 bc teacher said 20 too long
        setCheckedWords({}); 
        setHasStarted(true); 
      }, 1000);
      return () => clearTimeout(systemTimer);
    }
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isCounting, count]);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }
    if (gameTimer <= 0) {
      return;
    }
    if (isGameOver) {
      return;
    }

    const roundClock = setTimeout(() => {
      setGameTimer(gameTimer - 1); // subtracting 1 second lol
    }, 1000);

    return () => clearTimeout(roundClock);
  }, [hasStarted, gameTimer, isGameOver]);

  useEffect(() => {
    if (count === 0) {
      setIsGameOver(true);
    }
    if (hasStarted) {
      if (gameTimer === 0) {
        if (!isGameOver) {
          setHasStarted(false); 
          
          if (currentPlayer === 1) {
            setIsSwitchingPlayers(true);
            setSwitchCount(5);
          } else {
            if (currentRound < 2) {
              setCurrentRound(2);
              setCurrentPlayer(1); 
              setIsSwitchingPlayers(true);
              setSwitchCount(5);
            } else {
              setIsGameOver(true); // game over man game over
            }
          }
        }
      }
    }
  }, [gameTimer, hasStarted, currentPlayer, currentRound, isGameOver]);

  useEffect(() => { // next player overlaying stuff

    if (!isSwitchingPlayers) {
      return;
    }

    if (switchCount === 0) {
      setIsSwitchingPlayers(false);
      
      if (currentPlayer === 1) {
        setCurrentPlayer(2);
      } else {
        setCurrentPlayer(1);
      }
      
      if (currentCategory) {
        fetchCategoryData(currentCategory);
      }
      return;
    }

    const switchClock = setTimeout(() => {
      setSwitchCount(switchCount - 1);
    }, 1000);

    return () => clearTimeout(switchClock);
  }, [isSwitchingPlayers, switchCount, currentCategory]);

  const fetchCategoryData = (category) => {
    //  api stuff i copied from stackoverflow
    setLoading(true);
    setCurrentCategory(category); 
    setHasStarted(false);
    setIsGameOver(false);
    setData([]);

    fetch(`https://random-words-api.kushcreates.com/api?language=en&category=${category}&words=5`)
      .then((response) => response.json())
      .then((result) => {
        setData(result); 
        setLoading(false);
        if (isSwitchingPlayers) {
          handleStartCountdown();
        } else if (currentRound > 1) {
          handleStartCountdown();
        } else if (currentPlayer === 2) {
          handleStartCountdown();
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleStartCountdown = () => {
    setHasStarted(false); 
    setCount(3);          
    setIsCounting(true);  
  };

  const handleCheckboxChange = (index, isChecked) => {
    const nextWords = { ...checkedWords };
    nextWords[index] = isChecked;
    setCheckedWords(nextWords);

    if (currentPlayer === 1) {
      if (isChecked) {
        setP1Score(p1Score + 1); // PLUS ONE POINT id get or remove one if mislick
      } else {
        setP1Score(p1Score - 1);
      }
    } else { //does it for player 2
      if (isChecked) {
        setP2Score(p2Score + 1);
      } else {
        setP2Score(p2Score - 1); 
      }
    }

    // IF ALL FIVE WORDS ARE CHECKED THEN MAKE TIMER ZERO SO IT STOPS COZ ITS DONE!!!!
    let totalChecked = 0;
    if (nextWords[0]) { totalChecked = totalChecked + 1; }
    if (nextWords[1]) { totalChecked = totalChecked + 1; }
    if (nextWords[2]) { totalChecked = totalChecked + 1; }
    if (nextWords[3]) { totalChecked = totalChecked + 1; }
    if (nextWords[4]) { totalChecked = totalChecked + 1; }

    if (totalChecked === 5) {
      setGameTimer(0);
    }
  };

  const goBack = () => {// RESET EVERYTHING FOR RESTART COZ CLicking back resets game state
    setCurrentCategory(null); 
    setHasStarted(false);
    setIsGameOver(false);
    setData([]);
    setP1Score(0);
    setP2Score(0);
    setCurrentRound(1);
    setCurrentPlayer(1);
  };
  
  let countingDiv = null;
  if (isCounting) {
    let showText = count;
    if (count === 0) {
      showText = "GO!";
    }
    countingDiv = (
      <div className="countdown-overlay">
        <div className="countdown-text">
          {showText}
        </div>
      </div>
    );
  }

  let switchingDiv = null;
  if (isSwitchingPlayers) {
    let trackingPlayer = "1";
    if (currentPlayer === 1) {
      trackingPlayer = "2";
    }
    switchingDiv = (
      <div className="countdown-overlay switch-overlay">
        <div className="countdown-text transition-text">
          SWITCH PLAYERS!
          <div style={{ fontSize: '3rem', marginTop: '20px' }}>
            Player {trackingPlayer} Get Ready in: {switchCount}
          </div>
        </div>
      </div>
    );
  }

  let pageContent = null;
  if (!currentCategory) {
    pageContent = (
      <div className="card">
        <div className="card-content">
          <h3>Select a Category to Start:</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
{/* big button list of genres or whatever */}
            <Button variant="contained" className="sea-green-btn" onClick={() => fetchCategoryData("brainrot")}> Brain Rot </Button>
            <Button variant="contained" className="sea-green-btn" onClick={() => fetchCategoryData("birds")}> Birds </Button>
            <Button variant="contained" className="sea-green-btn" onClick={() => fetchCategoryData("animals")}> Animals </Button>
            <Button variant="contained" className="sea-green-btn" onClick={() => fetchCategoryData("sports")}> Sports </Button>
            <Button variant="contained" className="sea-green-btn" onClick={() => fetchCategoryData("games")}> Games </Button>
            <Button variant="contained" className="sea-green-btn" onClick={() => fetchCategoryData("companies")}> Companies </Button>
          </div>
        </div>
      </div>
    );
  } else {
    let headerText = null;
    if (isGameOver) {
      headerText = <h2 className="category-header" style={{ color: '#a32a2a' }}>GAME OVER!</h2>;
    } else {
      headerText = (
        <h2 className="category-header">
          ROUND {currentRound} - PLAYER {currentPlayer}'S TURN
        </h2>
      );
    }

    let actionButton = null;
    if (!loading) {
      if (data.length > 0) {
        if (!hasStarted) {
          if (!isCounting) {
            if (!isSwitchingPlayers) {
              if (!isGameOver) {
                actionButton = (
                  <div style={{ textAlign: "center", margin: "40px 0" }}>
                    <Button variant="contained" color="success" size="large" style={{ fontSize: "24px", padding: "10px 40px" }} onClick={handleStartCountdown}>
                      Start Player 1 Turn
                    </Button>
                  </div>
                );
              }
            }
          }
        }
      }
    }

    let resultsSection = null;
    if (loading) {
      resultsSection = <p>Loading new words...</p>;
    } else if (isGameOver) {
      let winAnnounce = "";
      if (p1Score === p2Score) {
        winAnnounce = "IT'S A TIE!";
      } else if (p1Score > p2Score) {
        winAnnounce = "PLAYER 1 WINS!";
      } else {
        winAnnounce = "PLAYER 2 WINS!";
      }
      resultsSection = (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ fontSize: '2rem' }}>
            {winAnnounce}
          </h3>
          <Button variant="contained" className="sea-green-btn" onClick={goBack} style={{ marginTop: '20px' }}>
            Play Again
          </Button>
        </div>
      );
    } else if (data.length > 0) {
      if (hasStarted) {
        let panicClass = "timer-circle";
        if (gameTimer <= 5) {
          panicClass = "timer-circle timer-panic";
        }
        
        let displayTimerNumber = gameTimer;
        if (gameTimer <= 0) {
          displayTimerNumber = "TIME UP!";
        }

        resultsSection = (
          <div className="gameplay-layout">
            <div className="words-column">
              <FormGroup>
                {data.map((item, index) => {
                  let isCheckedVal = false;
                  if (checkedWords[index]) {
                    isCheckedVal = true;
                  }
                  return (
                    <FormControlLabel 
                      key={index}
                      control={
                        <Checkbox 
                          checked={isCheckedVal} 
                          onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                          sx={{ color: '#2e8b57', '&.Mui-checked': { color: '#20b2aa' } }} 
                        />
                      } 
                      label={<strong>{item.word}</strong>} 
                      style={{ marginBottom: "10px" }}
                    />
                  );
                })}
              </FormGroup>
            </div>
            <div className="timer-column">
              <div className={panicClass}>
                <div className="timer-number">
                  {displayTimerNumber}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        resultsSection = (
          <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
            Get ready! Waiting for the countdown to drop your target words...
          </p>
        );
      }
    } else {
      resultsSection = <p>No words found.</p>;
    }

    pageContent = (
      <div className="main-game-layout">
        <div className="card gameplay-card">
          <div className="card-content">
            <Button variant="outlined" onClick={goBack} style={{ marginBottom: "15px", color: "#2e8b57", borderColor: "#2e8b57" }}>
               Back to Categories
            </Button>
            {headerText}
            {actionButton}
            <div className="results">
              {resultsSection}
            </div>
          </div>
        </div>

{/* SCOREBOARD HTML HUH */}
        <div className="scoreboard-container">
          <h3 className="scoreboard-title">SCOREBOARD</h3>
          <div className="score-row p1-row">
            <span className="score-label">PLAYER 1</span>
            <span className="score-value">{p1Score}</span>
          </div>
          <div className="score-row p2-row">
            <span className="score-label">PLAYER 2</span>
            <span className="score-value">{p2Score}</span>
          </div>
          <div className="scoreboard-footer">
            Current Mode: 2 Rounds Max
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {countingDiv}
      {switchingDiv}
      
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div className="title">
          Wordless
        </div>
      </div>

      <div className="instructions-container">
        <p className="instructions-text">
          Grab a partner, take turns describing the words without saying them, and score the most points before the timer runs out—be a good sport!
        </p>
      </div>

{/* this renders standard html block variable thingy from up top */}
      {pageContent}
    </div>
  );
}

export default App;