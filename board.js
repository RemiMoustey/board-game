class Board {
    constructor(numberLines, numberColumns) {
        this.squares = this.createSquares(numberLines, numberColumns);
        this.weapons = [
            new Weapon("pistol", "img/pistol.png", 10),
            new Weapon("shotgun", "img/shotgun.png", 20),
            new Weapon("rocket_launcher", "img/rocket_launcher.png", 50),
            new Weapon("pump-action_shotgun", "img/pump-action_shotgun.png", 35)
        ];
        this.players = [new Player("img/playerA.png"), new Player("img/playerB.png")];
        $("#formWalls").submit(this.generateInitialBoard);
    }

    createSquares = (numberLines, numberColumns) => {
        let squares = Array(10).fill(null).map(() => Array(10).fill(null).map(() => null));
        for(let i = 0; i < numberLines; i++) {
            for(let j = 0; j < numberColumns; j++) {
                squares[i][j] = new Square(i, j);
            }
        }
        return squares;
    }

    getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    getRandomRaw = () => this.getRandomNumber(0, 9);

    getRandomSquare = () => this.squares[this.getRandomRaw()][this.getRandomRaw()];

    generateInitialBoard = (e) => {
        e.preventDefault();
        let numberWalls = $("#walls").val();
        this.insertWalls(numberWalls);
        this.summonWeapons($("#weapons").val());
        this.summonPlayers();
        document.querySelector("#formWalls").innerHTML = "";
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
        let randomSquare = this.getRandomSquare();
        while(randomSquare.isGrayedOut) {
            randomSquare = this.getRandomSquare();
        }
        let travelledSquares = [randomSquare];
        travelledSquares = this.goAround(randomSquare.coordinates.x, randomSquare.coordinates.y, travelledSquares);
        let numberWalls = 0;
        for(let line of this.squares) {
            numberWalls += line.filter(square => square.isGrayedOut).length;
        }
        if(numberWalls !== this.squares.length * this.squares[0].length - travelledSquares.length) {
            this.squares = this.createSquares(10, 10);
            this.insertWalls(numberWalls);
        }
    }

    getTravelledSquaresInMove = (condition, i, j, travelledSquares) => {
        if(condition && !this.squares[i][j].isGrayedOut &&
            !travelledSquares.some(square => square.coordinates.x === i && square.coordinates.y === j)) {
            travelledSquares.push(this.squares[i][j]);
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

    summonWeapons = (numberWeapons) => {
        let squaresWithWeapon = [];

        for(let i = 0; i < numberWeapons; i++) {
            let randomSquare = this.getRandomSquare();
            while(randomSquare.isGrayedOut || randomSquare.hasWeapon) {
                randomSquare = this.getRandomSquare();
            }
            randomSquare.hasWeapon = true;
            squaresWithWeapon.push(randomSquare);
        }
        for(let square of squaresWithWeapon) {
            square.weapon = this.weapons[this.getRandomNumber(0, this.weapons.length - 1)];
        }
    }

    arePlayersSideBySide = (squarePlayerOne, squarePlayerTwo) => 
    squarePlayerOne.x - 1 === squarePlayerTwo.x && squarePlayerOne.y - 1 === squarePlayerTwo.y ||
    squarePlayerOne.x - 1 === squarePlayerTwo.x && squarePlayerOne.y === squarePlayerTwo.y ||
    squarePlayerOne.x + 1 === squarePlayerTwo.x && squarePlayerOne.y + 1 === squarePlayerTwo.y ||
    squarePlayerOne.x === squarePlayerTwo.x && squarePlayerOne.y + 1 === squarePlayerTwo.y ||
    squarePlayerOne.x + 1 === squarePlayerTwo.x && squarePlayerOne.y + 1 === squarePlayerTwo.y ||
    squarePlayerOne.x + 1 === squarePlayerTwo.x && squarePlayerOne.y === squarePlayerTwo.y ||
    squarePlayerOne.x + 1 === squarePlayerTwo.x && squarePlayerOne.y - 1 === squarePlayerTwo.y ||
    squarePlayerOne.x === squarePlayerTwo.x && squarePlayerOne.y - 1 === squarePlayerTwo.y;

    summonPlayers = () => {
        let squaresWithPlayerAtTheBeginning = [];
        for(let i = 0; i < 2; i++) {
            let randomSquare = this.getRandomSquare();
            while(randomSquare.isGrayedOut || randomSquare.hasWeapon || randomSquare.hasPlayer ||
            i === 1 && this.arePlayersSideBySide(squaresWithPlayerAtTheBeginning[0], randomSquare)) {
                randomSquare = this.getRandomSquare();
            }
            randomSquare.hasPlayer = true;
            squaresWithPlayerAtTheBeginning.push(randomSquare);
        }
        for(let i = 0; i < 2; i++) {
            squaresWithPlayerAtTheBeginning[i].player = this.players[i];
        }
    }
}

new Board(10, 10);