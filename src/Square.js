class Square {
    constructor() {
        this.hasBomb = (Math.random() > 0.77);
        this.isUncovered = false;
        this.isFlagged = false;
        this.adjacentMines = -1;
    }

    click() {
        // if flagged, the flag can be removed by clicking on the square
        if (this.isFlagged) {
            this.isUncovered = false;
            this.flag();

        } else {
            // else toggle isUncovered
            if (this.isUncovered)
                this.isUncovered = false;
            else
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

    setAdjacentMines(numMines) {
        this.adjacentMines = numMines;
        if (this.adjacentMines >= 0 && !this.hasBomb)
            this.isUncovered = true;
    }

    placeMine() {
        this.hasBomb = true
    }
}

export default Square;