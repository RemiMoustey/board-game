class Board {
    constructor() {
        this.squares = Array(10).fill(null).map(() => Array(10).fill(null).map(() => new Square()));
        $("#formWalls").submit(this.generateInitialBoard);
    }

    getRandomRaw = () => Math.floor(Math.random() * 10);

    generateInitialBoard = (e) => {
        e.preventDefault();
        let numberWalls = $("#walls").val();
        document.querySelector("#formWalls").innerHTML = "";
        this.insertWalls(numberWalls);
    }

    insertWalls = (numberWalls) => {
        if(!isNaN(numberWalls) && numberWalls >= 8 && numberWalls <= 14) {
            for(let i = 0; i < numberWalls; i++) {
                this.grayOverOneSquare(this.getRandomRaw(), this.getRandomRaw());
            }
            this.verifyAllBoardIsAccessible();
        } else {
            document.getElementById("board").textContent = "Erreur : données envoyées incorrectes.";
        }
    }

    grayOverOneSquare = (line, column) => {
        if(this.squares[line][column].isGrayedOut) {
            this.grayOverOneSquare(this.getRandomRaw(), this.getRandomRaw());
        } else {
            this.squares[line][column].isGrayedOut = true;
        }
    }

    verifyAllBoardIsAccessible = () => {
        let iRandomSquare = this.getRandomRaw();
        let jRandomSquare = this.getRandomRaw();
        let randomSquare = this.squares[iRandomSquare][jRandomSquare];
        while(randomSquare.isGrayedOut) {
            iRandomSquare = this.getRandomRaw();
            jRandomSquare = this.getRandomRaw();
            randomSquare = this.squares[iRandomSquare][jRandomSquare];
        }
        let travelledSquares = [{square: randomSquare, i: iRandomSquare, j: jRandomSquare}];
        travelledSquares = this.goAround(iRandomSquare, jRandomSquare, travelledSquares);
        let numberWalls = 0;
        for(let line of this.squares) {
            numberWalls += line.filter(square => square.isGrayedOut).length;
        }
        if(numberWalls !== this.squares.length * this.squares[0].length - travelledSquares.length) {
            this.squares = Array(10).fill(null).map(() => Array(10).fill(null).map(() => new Square()));
            this.insertWalls(numberWalls);
        }
    }

    getTravelledSquaresInMove = (condition, i, j, travelledSquares) => {
        if(condition && !this.squares[i][j].isGrayedOut && !travelledSquares.some(square => square.i === i && square.j === j)) {
            travelledSquares.push({square: this.squares[i][j], i: i, j: j});
            this.goAround(i, j, travelledSquares);
        }
        return travelledSquares;
    }

    goAround = (i, j, travelledSquares) => {
        travelledSquares = this.getTravelledSquaresInMove(j !== 0, i, j - 1, travelledSquares);
        travelledSquares = this.getTravelledSquaresInMove(i !== 0, i - 1, j, travelledSquares);
        travelledSquares = this.getTravelledSquaresInMove(j !== this.squares.length - 1, i, j + 1, travelledSquares);
        travelledSquares = this.getTravelledSquaresInMove(i !== this.squares.length - 1, i + 1, j, travelledSquares);
        return travelledSquares;
    }
}

new Board();