import { faBomb, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Square from "./Square";

function App() {
  const MAX = 16;
  const MIN = 8;

  const [numRows, setNumRows] = useState(MIN);
  const [numCols, setNumCols] = useState(MIN);
  const [minefield, setMinefield] = useState([]);
  const [gameover, setGameover] = useState(false);

  const generateMinefield = () => {
    let newMinefield = [];

    for (let i = 0; i < numRows; i++) {
      let cols = [];

      for (let j = 0; j < numCols; j++) {
        cols.push(new Square());
      }

      newMinefield.push(cols);
    }

    setMinefield(newMinefield);
  };

  const isValidNumber = (inputNumber) => {
    const num = parseInt(inputNumber);

    if (isNaN(num)) {
      // not a number
      return false;
    }

    if (num < MIN || num > MAX) return false;

    return true;
  };

  const calculateAdjacentMines = (indexRow, indexCol) => {
    let numMines = 0;

    try {
      if (minefield[indexRow - 1][indexCol - 1].hasBomb) {
        numMines++;
      }
    } catch (error) {}

    try {
      if (minefield[indexRow - 1][indexCol].hasBomb) {
        numMines++;
      }
    } catch (error) {}

    try {
      if (minefield[indexRow - 1][indexCol + 1].hasBomb) {
        numMines++;
      }
    } catch (error) {}

    try {
      if (minefield[indexRow][indexCol - 1].hasBomb) {
        numMines++;
      }
    } catch (error) {}

    try {
      if (minefield[indexRow][indexCol + 1].hasBomb) {
        numMines++;
      }
    } catch (error) {}

    try {
      if (minefield[indexRow + 1][indexCol - 1].hasBomb) {
        numMines++;
      }
    } catch (error) {}

    try {
      if (minefield[indexRow + 1][indexCol].hasBomb) {
        numMines++;
      }
    } catch (error) {}

    try {
      if (minefield[indexRow + 1][indexCol + 1].hasBomb) {
        numMines++;
      }
    } catch (error) {}

    return numMines;
  };

  const handleNumRowsChange = (e) => {
    if (!isValidNumber(e.target.value)) return;
    setNumRows(e.target.value);
  };
  const handleNumColsChange = (e) => {
    if (!isValidNumber(e.target.value)) return;
    setNumCols(e.target.value);
  };

  const handleOnClickSquare = (e, indexRow, indexCol) => {
    e.preventDefault();

    let square = minefield[indexRow][indexCol];

    if (e.type === "click") {
      square.click();
      if (square.hasBomb) {
        setGameover(true);
      } else {
        const numMines = calculateAdjacentMines(indexRow, indexCol);
        square.setAdjacentMines(numMines);
      }
    } else if (e.type === "contextmenu") {
      square.flag();
    }

    minefield[indexRow][indexCol] = square;
    setMinefield([...minefield]);
  };

  useEffect(() => {
    generateMinefield();
  }, [numRows, numCols]);

  useEffect(() => {
    if (gameover) {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          minefield[i][j].setAdjacentMines(calculateAdjacentMines(i, j));
        }
      }

      setMinefield([...minefield]);
    }
  }, [gameover]);

  return (
    <>
      <div className="form">
        <form>
          <label htmlFor="numRows">Rows</label>
          <input
            id="numRows"
            type="number"
            placeholder="Number of rows"
            value={numRows}
            onChange={handleNumRowsChange}
          />

          <label htmlFor="numCols">Cols</label>
          <input
            id="numCols"
            type="number"
            placeholder="Number of columns"
            value={numCols}
            onChange={handleNumColsChange}
          />
        </form>
      </div>
      <div className="minefield">
        {minefield.map((row, indexRow) => (
          <div key={indexRow} className="row">
            {row.map((square, indexCol) => (
              <button
                className="square"
                key={`${indexRow}-${indexCol}`}
                onClick={(e) => handleOnClickSquare(e, indexRow, indexCol)}
                onContextMenu={(e) =>
                  handleOnClickSquare(e, indexRow, indexCol)
                }
                disabled={gameover}
              >
                {gameover ? (
                  square.hasBomb ? (
                    <FontAwesomeIcon icon={faBomb} />
                  ) : (
                    square.adjacentMines
                  )
                ) : square.isClicked ? (
                  square.hasBomb ? (
                    <FontAwesomeIcon icon={faBomb} />
                  ) : square.adjacentMines !== -1 ? (
                    square.adjacentMines
                  ) : (
                    ""
                  )
                ) : square.isFlagged ? (
                  <FontAwesomeIcon icon={faFlag} />
                ) : (
                  ""
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
