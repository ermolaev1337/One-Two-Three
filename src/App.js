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
  const [wasted, setWasted] = useState(false);
  const [victory, setVictory] = useState(false);
  const [positions, setPositions] = useState({ Uno: [], Due: [], Tre: [] });
  const [wastedPosition, setWastedPosition] = useState('');

  const initGame = () => {
    const initialDeck = suits.flatMap(suit => values.map(value => ({ suit, value })));
    const fullDeck = [...initialDeck, ...initialDeck, ...initialDeck, ...initialDeck];
    setDeck(shuffle(fullDeck));
    setCurrentCardIndex(0);
    setGameActive(true);
    setWasted(false);
    setVictory(false);
    setPositions({ Uno: [], Due: [], Tre: [] });
    setWastedPosition('');
  };

  useEffect(() => {
    initGame();
  }, []);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const drawCard = () => {
    if (!gameActive) {
      initGame();
      return;
    }

    const card = deck[currentCardIndex];
    const position = currentCardIndex % 3;
    const positionName = position === 0 ? 'Uno' : position === 1 ? 'Due' : 'Tre';
    setPositions((prevPositions) => ({
      ...prevPositions,
      [positionName]: [card], // Replace the card at the position
    }));
    setCurrentCardIndex(currentCardIndex + 1);

    if ((position === 0 && card.value === 'ace') || (position === 1 && card.value === '2') || (position === 2 && card.value === '3')) {
      setGameActive(false);
      setGamesPlayed(gamesPlayed + 1);
      setWasted(true);
      setWastedPosition(positionName);
      return;
    }

    if (currentCardIndex === 39) {
      setGameActive(false);
      setGamesPlayed(gamesPlayed + 1);
      setVictories(victories + 1);
      setVictory(true);
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
          <div className={`position ${wastedPosition === 'Uno' ? 'wasted' : ''}`} id="uno">
            <div className="label" style={{ display: positions.Uno.length ? 'none' : 'block' }}>UNO</div>
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
          <div className={`position ${wastedPosition === 'Due' ? 'wasted' : ''}`} id="due">
            <div className="label" style={{ display: positions.Due.length ? 'none' : 'block' }}>DUE</div>
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
          <div className={`position ${wastedPosition === 'Tre' ? 'wasted' : ''}`} id="tre">
            <div className="label" style={{ display: positions.Tre.length ? 'none' : 'block' }}>TRE</div>
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
        {wasted && <div className="result wasted"><span>WASTED</span></div>}
        {victory && <div className="result victory"><span>VICTORY</span></div>}
        <div className="deck-button-container">
          <button id="drawButton" onClick={drawCard}>
            <img src={`${process.env.PUBLIC_URL}/cards/skin.jpg`} alt="Draw a card" className="button-card" />
          </button>
          <div className="cardCount">{40 - currentCardIndex}</div>
        </div>
        <div id="stats">
          Games played: <span id="gamesPlayed">{gamesPlayed}</span>
          <br />
          Victories: <span id="victories">{victories}</span>
        </div>
      </div>
  );
};

export default App;
