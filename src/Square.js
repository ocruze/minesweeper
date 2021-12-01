class Square {
    constructor() {
        this.hasMine = (Math.random() > 0.70);
        this.isUncovered = false;
        this.isFlagged = false;
        this.neighboringMines = 0;
        this.adjacentSquares = [];
        this.neighboringSquares = [];
    }

    click() {
        // if flagged, the flag can be removed by clicking on the square
        if (this.isFlagged) {
            this.isUncovered = false;
            this.flag();

        } else {
            // uncover if not already uncovered
            if (!this.isUncovered)
                this.isUncovered = true;
        }
    }

    flag() {
        // if already uncovered, can do nothing
        if (this.isUncovered) return;

        if (this.isFlagged)
            this.isFlagged = false;
        else
            this.isFlagged = true;
    }

    uncover() {
        this.isUncovered = true;
    }

    setNeighboringMines(numMines) {
        this.neighboringMines = numMines;
    }


    setAdjacentSquares(adjSquares) {
        this.adjacentSquares = adjSquares;
    }

    setNeighboringSquares(neighbSquares) {
        this.neighboringSquares = neighbSquares;
    }

    placeMine() {
        this.hasMine = true
    }
}

export default Square;