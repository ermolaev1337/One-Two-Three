import React, { useState, useEffect } from 'react';
import './App.css';

const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const values = ['ace', '2', '3', '4', '5', '6', '7', 'jack', 'queen', 'king'];

const App = () => {
  const [deck, setDeck] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [victories, setVictories] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [positions, setPositions] = useState({ Uno: [], Due: [], Tre: [] });

  const initGame = () => {
    const initialDeck = suits.flatMap(suit => values.map(value => ({ suit, value })));
    const fullDeck = shuffle([...initialDeck, ...initialDeck, ...initialDeck, ...initialDeck]);
    setDeck(fullDeck);
    setCurrentCardIndex(0);
    setGameActive(true);
    setPositions({ Uno: [], Due: [], Tre: [] });
  };

  useEffect(() => {
    initGame();
    // eslint-disable-next-line
  }, []);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const playSound = (soundFile) => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/${soundFile}`);
    audio.play();
  };

  const drawCard = () => {
    if (!gameActive) {
      initGame();
      return;
    }

    setTotalClicks(totalClicks + 1);
    const card = deck[currentCardIndex];
    const position = currentCardIndex % 3;
    const positionName = position === 0 ? 'Uno' : position === 1 ? 'Due' : 'Tre';
    setPositions((prevPositions) => ({
      ...prevPositions,
      [positionName]: [card],
    }));
    setCurrentCardIndex(currentCardIndex + 1);

    const soundName = position === 0 ? 'uno.mp3' : position === 1 ? 'due.mp3' : 'tre.mp3';
    playSound(soundName);

    if ((position === 0 && card.value === 'ace') || (position === 1 && card.value === '2') || (position === 2 && card.value === '3')) {
      setGameActive(false);
      setGamesPlayed(gamesPlayed + 1);
      playSound('porco_dio.mp3');
      setTimeout(initGame, 1000);  // Start a new game after 1 second
      return;
    }

    if (currentCardIndex === 39) {
      setGameActive(false);
      setGamesPlayed(gamesPlayed + 1);
      setVictories(victories + 1);
      playSound('molto_bene.mp3');
      setTimeout(initGame, 1000);  // Start a new game after 1 second
      return;
    }
  };

  const getCardImage = (card) => {
    if (!card) return null;
    return `${process.env.PUBLIC_URL}/cards/${card.value}_of_${card.suit}.png`;
  };

  return (
      <div id="gameContainer">
        <div className="board">
          <div className="position" id="uno">
            <div className="cards">
              {positions.Uno.map((card, index) => (
                  <img
                      key={index}
                      src={getCardImage(card)}
                      alt={`${card.value} of ${card.suit}`}
                      className="card"
                  />
              ))}
            </div>
          </div>
          <div className="position" id="due">
            <div className="cards">
              {positions.Due.map((card, index) => (
                  <img
                      key={index}
                      src={getCardImage(card)}
                      alt={`${card.value} of ${card.suit}`}
                      className="card"
                  />
              ))}
            </div>
          </div>
          <div className="position" id="tre">
            <div className="cards">
              {positions.Tre.map((card, index) => (
                  <img
                      key={index}
                      src={getCardImage(card)}
                      alt={`${card.value} of ${card.suit}`}
                      className="card"
                  />
              ))}
            </div>
          </div>
        </div>
        <div className="deck-button-container">
          <button id="drawButton" onClick={drawCard}>
            <img src={`${process.env.PUBLIC_URL}/cards/skin.jpg`} alt="Draw a card" className="button-card" />
          </button>
          <div className="cardCount">{40 - currentCardIndex}</div>
        </div>
        <div id="stats">
          Total clicks: <span id="totalClicks">{totalClicks}</span>
          <br />
          Games played: <span id="gamesPlayed">{gamesPlayed}</span>
          <br />
          Victories: <span id="victories">{victories}</span>
        </div>
      </div>
  );
};

export default App;
