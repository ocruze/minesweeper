import { faBomb, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Square from "./Square";

function App() {
  const MAX = 32;
  const MIN = 8;
  const DEFAULT = 16;

  const [numRows, setNumRows] = useState(DEFAULT);
  const [numCols, setNumCols] = useState(DEFAULT);
  const [minefield, setMinefield] = useState([]);
  const [gameover, setGameover] = useState(false);

  const generateMinefield = () => {
    const newMinefield = [];

    for (let i = 0; i < numRows; i++) {
      let cols = [];

      for (let j = 0; j < numCols; j++) {
        cols.push(new Square());
      }

      newMinefield.push(cols);
    }

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const adjSquares = getAdjacentSquares(newMinefield, i, j);
        const neighbSquares = getNeighboringSquares(newMinefield, i, j);
        const adjMines = getNeighboringSquaresWithMine(
          newMinefield,
          neighbSquares
        );

        newMinefield[i][j].setNeighboringMines(adjMines);
        newMinefield[i][j].setAdjacentSquares(adjSquares);
        newMinefield[i][j].setNeighboringSquares(neighbSquares);
      }
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

  const getAdjacentSquares = (minefield, indexRow, indexCol) => {
    let adjSquares = [];
    let possibleAdjacent = [
      [indexRow - 1, indexCol],
      [indexRow, indexCol - 1],
      [indexRow, indexCol + 1],
      [indexRow + 1, indexCol],
    ];

    possibleAdjacent.forEach((coord) => {
      try {
        if (minefield[coord[0]][coord[1]]) {
          adjSquares.push(coord);
        }
      } catch (error) {}
    });

    return adjSquares;
  };

  const getNeighboringSquares = (minefield, indexRow, indexCol) => {
    let neighbSquares = [];
    let possibleNeighbor = [
      [indexRow - 1, indexCol - 1],
      [indexRow - 1, indexCol],
      [indexRow - 1, indexCol + 1],
      [indexRow, indexCol - 1],
      [indexRow, indexCol + 1],
      [indexRow + 1, indexCol - 1],
      [indexRow + 1, indexCol],
      [indexRow + 1, indexCol + 1],
    ];

    possibleNeighbor.forEach((coord) => {
      try {
        if (minefield[coord[0]][coord[1]]) {
          neighbSquares.push(coord);
        }
      } catch (error) {}
    });

    return neighbSquares;
  };

  const getNeighboringSquaresWithMine = (minefield, adjSquares) => {
    let numMines = 0;

    adjSquares.forEach((coord) => {
      if (minefield[coord[0]][coord[1]].hasMine) {
        numMines++;
      }
    });

    return numMines;
  };

  const uncoverAdjacentMinesRecursive = (adjSquares) => {
    for (let i = 0; i < adjSquares.length; i++) {
      const coord = adjSquares[i];
      const currentAdjSquare = minefield[coord[0]][coord[1]];

      if (!currentAdjSquare.isUncovered && !currentAdjSquare.hasMine) {
        currentAdjSquare.uncover();

        if (currentAdjSquare.neighboringMines === 0) {
          const subAdjSquares = currentAdjSquare.adjacentSquares;
          uncoverAdjacentMinesRecursive(subAdjSquares);
        }
      }
    }

    setMinefield([...minefield]);
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
      if (square.hasMine) {
        setGameover(true);
      } else {
        uncoverAdjacentMinesRecursive(square.adjacentSquares);
        // setMinefield([...minefield]);
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
          minefield[i][j].uncover();
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
                className={`square ${square.isUncovered ? "uncovered" : ""}`}
                key={`${indexRow}-${indexCol}`}
                onClick={(e) => handleOnClickSquare(e, indexRow, indexCol)}
                onContextMenu={(e) =>
                  handleOnClickSquare(e, indexRow, indexCol)
                }
                disabled={gameover}
              >
                {gameover ? (
                  square.hasMine ? (
                    <FontAwesomeIcon icon={faBomb} />
                  ) : (
                    square.neighboringMines
                  )
                ) : square.isUncovered ? (
                  square.hasMine ? (
                    <FontAwesomeIcon icon={faBomb} />
                  ) : (
                    square.neighboringMines
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
