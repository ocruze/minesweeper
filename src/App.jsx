import { faBomb, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Square from "./Square";

function App() {
  const MAX = 32;
  const MIN = 16;

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

    // const numMines = 40;

    // for (let k = 0; k < numMines; k++) {
    //   let alreadyMinesNum = null;
    //   let randRow = null;
    //   let randCol = null;

    //   do {
    //     randRow = Math.floor(Math.random() * numRows);
    //     randCol = Math.floor(Math.random() * numCols);

    //     let adjSquares = getAdjacentSquares(randRow, randCol);
    //     alreadyMinesNum = getAdjacentSquaresWithBomb(adjSquares);
    //   } while (alreadyMinesNum > 2);

    //   newMinefield[randRow][randCol].placeMine();
    // }

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

  const getAdjacentSquares = (indexRow, indexCol) => {
    let adjSquares = [];
    let possibleAdjacent = [
      [indexRow - 1, indexCol - 1],
      [indexRow - 1, indexCol],
      [indexRow - 1, indexCol + 1],
      [indexRow, indexCol - 1],
      [indexRow, indexCol + 1],
      [indexRow + 1, indexCol - 1],
      [indexRow + 1, indexCol],
      [indexRow + 1, indexCol + 1],
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

  const getAdjacentSquaresWithBomb = (adjSquares) => {
    let numMines = 0;

    adjSquares.forEach((coord) => {
      if (minefield[coord[0]][coord[1]].hasBomb) {
        numMines++;
      }
    });

    return numMines;
  };

  const uncoverAdjacentMinesRecursive = (adjSquares) => {
    adjSquares.forEach((coord) => {
      let subAdjSquares = getAdjacentSquares(coord[0], coord[1]);
      let subNumMines = getAdjacentSquaresWithBomb(subAdjSquares);
      minefield[coord[0]][coord[1]].setAdjacentMines(subNumMines);

      if (subNumMines === 0) {
        uncoverAdjacentMinesRecursive(subAdjSquares);
      }
    });
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
        const adjSquares = getAdjacentSquares(indexRow, indexCol);
        const numMines = getAdjacentSquaresWithBomb(adjSquares);
        square.setAdjacentMines(numMines);

        uncoverAdjacentMinesRecursive(adjSquares);
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
          const adjSquares = getAdjacentSquares(i, j);
          const numMines = getAdjacentSquaresWithBomb(adjSquares);
          minefield[i][j].setAdjacentMines(numMines);
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
                  square.hasBomb ? (
                    <FontAwesomeIcon icon={faBomb} />
                  ) : (
                    square.adjacentMines
                  )
                ) : square.isUncovered ? (
                  square.hasBomb ? (
                    <FontAwesomeIcon icon={faBomb} />
                  ) : square.adjacentMines > 0 ? (
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
