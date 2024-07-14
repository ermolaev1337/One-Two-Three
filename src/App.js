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
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [wasted, setWasted] = useState(false);
  const [victory, setVictory] = useState(false);
  const [positions, setPositions] = useState({ Uno: '', Due: '', Tre: '' });
  const [wastedPosition, setWastedPosition] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' && !spaceHeld) {
        setSpaceHeld(true);
        const intervalId = setInterval(() => {
          if (!spaceHeld) {
            clearInterval(intervalId);
          } else {
            drawCard();
          }
        }, 100); // Adjust the interval as needed
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
        setSpaceHeld(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [spaceHeld]);

  const initGame = () => {
    const initialDeck = suits.flatMap(suit => values.map(value => ({ suit, value })));
    const fullDeck = [...initialDeck, ...initialDeck, ...initialDeck, ...initialDeck];
    setDeck(shuffle(fullDeck));
    setCurrentCardIndex(0);
    setGameActive(true);
    setSpaceHeld(false);
    setWasted(false);
    setVictory(false);
    setPositions({ Uno: '', Due: '', Tre: '' });
    setWastedPosition('');
  };

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
    setPositions((prevPositions) => ({ ...prevPositions, [positionName]: card }));
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
        <h1>Card Game</h1>
        <div className="deck-container">
          <div className={`deck ${victory ? 'victory' : ''}`}>
            <div className="label">Deck</div>
            <div className="cardCount">{40 - currentCardIndex}</div>
          </div>
        </div>
        <div className="board">
          <div className={`position ${wastedPosition === 'Uno' ? 'wasted' : ''}`} id="uno">
            <div className="label">UNO</div>
            <div className="card">
              {positions.Uno && <img src={getCardImage(positions.Uno)} alt={`${positions.Uno.value} of ${positions.Uno.suit}`} />}
            </div>
          </div>
          <div className={`position ${wastedPosition === 'Due' ? 'wasted' : ''}`} id="due">
            <div className="label">DUE</div>
            <div className="card">
              {positions.Due && <img src={getCardImage(positions.Due)} alt={`${positions.Due.value} of ${positions.Due.suit}`} />}
            </div>
          </div>
          <div className={`position ${wastedPosition === 'Tre' ? 'wasted' : ''}`} id="tre">
            <div className="label">TRE</div>
            <div className="card">
              {positions.Tre && <img src={getCardImage(positions.Tre)} alt={`${positions.Tre.value} of ${positions.Tre.suit}`} />}
            </div>
          </div>
        </div>
        {wasted && <div className="result wasted">WASTED</div>}
        {victory && <div className="result victory">VICTORY</div>}
        <button id="drawButton" onClick={drawCard}>
          {gameActive ? 'Draw a Card' : 'Start Again'}
        </button>
        <div id="stats">
          Games played: <span id="gamesPlayed">{gamesPlayed}</span>
          <br />
          Victories: <span id="victories">{victories}</span>
        </div>
      </div>
  );
};

export default App;
