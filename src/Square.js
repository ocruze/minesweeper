class Square {
    constructor() {
        this.hasBomb = (Math.random() > 0.77);
        this.isClicked = false;
        this.isFlagged = false;
        this.adjacentMines = -1;
    }

    click() {
        // if flagged, the flag can be removed by clicking on the square
        if (this.isFlagged) {
            this.isClicked = false;
            this.flag();

        } else {
            // else toggle isClicked
            if (this.isClicked)
                this.isClicked = false;
            else
                this.isClicked = true;
        }
    }

    flag() {
        // if already clicked, can do nothing
        if (this.isClicked) return;

        if (this.isFlagged)
            this.isFlagged = false;
        else
            this.isFlagged = true;
    }

    setAdjacentMines(numMines) {
        this.adjacentMines = numMines;
    }
}

export default Square;