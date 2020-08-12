class Board {
    constructor(numberLines, numberColumns) {
        this.squares = this.createSquares(numberLines, numberColumns);
        this.weapons = [
            new Weapon("Pistol", "pistol.png", 10),
            new Weapon("Shotgun", "shotgun.png", 20),
            new Weapon("Rocket launcher", "rocket_launcher.png", 50),
            new Weapon("Pump-action shotgun", "pump-action_shotgun.png", 35)
        ];
        this.players = [new Player("player1"), new Player("player2")];
        this.currentPlayer = this.players[0];
        this.currentReachableSquares = null;
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
    }

    determineImage = (square) => {
        let image;
        if(square.hasPlayer) {
            image = square.player.image;
        } else if(square.hasWeapon) {
            image = square.weapon.image;
        } else if(square.grayedOut) {
            image = "wall.png";
        } else {
            image = "empty_square.png";
        }
        return image;
    }

    printBoard = () => {
        document.querySelector("#formWalls").innerHTML = "";
        let squarePlayerOne;
        for(let raw of this.squares) {
            let images = [];
            for(let square of raw) {
                let image = this.determineImage(square);
                if(image === "player1.png" || image === "medium-player1.png" || image === "mini-player1.png") {
                    squarePlayerOne = square;
                }
                images.push(image);
            }
            this.printRow(images);
        }
        this.doARound(squarePlayerOne);
    }

    getHtmlImage = (name) => {
        let htmlImage = $(document.createElement("img"));
        htmlImage.attr("src", name);
        htmlImage.attr("alt", "Une case");
        htmlImage.addClass("square");
        return htmlImage;
    }

    getHtmlSource = (media, image) => {
        let htmlSource = $(document.createElement("source"));
        htmlSource.attr("media", media);
        htmlSource.attr("srcset", image);
        return htmlSource;
    }

    printRow = (images) => {
        let row = $(document.createElement("div"));
        for(let image of images) {
            let picture = $(document.createElement("picture"));
            let htmlLargeImage = this.getHtmlImage("img/" + image);
            if(image === "player1.png") {
                htmlLargeImage.attr("id", "player1");
            } else if(image === "player2.png") {
                htmlLargeImage.attr("id", "player2");
            } else if(image === "empty_square.png") {
                htmlLargeImage.addClass("empty");
            }
            let sourceMedium = this.getHtmlSource("(max-width: 991px)", "img/medium-" + image);
            let sourceMini = this.getHtmlSource("(max-width: 575px)", "img/mini-" + image);
            picture.append(sourceMini, sourceMedium, htmlLargeImage);
            row.append(picture);
        }
        $("#board").append(row);
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
        if(this.squares[line][column].grayedOut) {
            this.grayOverOneSquare(this.getRandomRaw(), this.getRandomRaw());
        } else {
            this.squares[line][column].grayedOut = true;
        }
    }

    verifyAllBoardIsAccessible = () => {
        let randomSquare = this.getRandomSquare();
        while(randomSquare.grayedOut) {
            randomSquare = this.getRandomSquare();
        }
        let travelledSquares = [randomSquare];
        travelledSquares = this.goAround(randomSquare.coordinates.x, randomSquare.coordinates.y, travelledSquares);
        let numberWalls = 0;
        for(let line of this.squares) {
            numberWalls += line.filter(square => square.grayedOut).length;
        }
        if(numberWalls !== this.squares.length * this.squares[0].length - travelledSquares.length) {
            this.squares = this.createSquares(10, 10);
            this.insertWalls(numberWalls);
        }
    }

    getTravelledSquaresInMove = (condition, i, j, travelledSquares) => {
        if(condition && !this.squares[i][j].grayedOut &&
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
        if(!isNaN(numberWeapons) && numberWeapons >= 1 && numberWeapons <= 4) {
            let squaresWithWeapon = [];

            for(let i = 0; i < numberWeapons; i++) {
                let randomSquare = this.getRandomSquare();
                while(randomSquare.grayedOut || randomSquare.hasWeapon) {
                    randomSquare = this.getRandomSquare();
                }
                randomSquare.hasWeapon = true;
                squaresWithWeapon.push(randomSquare);
            }
            for(let square of squaresWithWeapon) {
                square.weapon = this.weapons[this.getRandomNumber(0, this.weapons.length - 1)];
            }
            this.summonPlayers();
        } else {
            document.getElementById("board").textContent = "Erreur : données envoyées incorrectes.";
        }
    }

    arePlayersSideBySide = (coordinatesPlayerOne, coordinatesPlayerTwo) => 
    coordinatesPlayerOne.x - 1 === coordinatesPlayerTwo.x && coordinatesPlayerOne.y - 1 === coordinatesPlayerTwo.y ||
    coordinatesPlayerOne.x - 1 === coordinatesPlayerTwo.x && coordinatesPlayerOne.y === coordinatesPlayerTwo.y ||
    coordinatesPlayerOne.x - 1 === coordinatesPlayerTwo.x && coordinatesPlayerOne.y + 1 === coordinatesPlayerTwo.y ||
    coordinatesPlayerOne.x === coordinatesPlayerTwo.x && coordinatesPlayerOne.y + 1 === coordinatesPlayerTwo.y ||
    coordinatesPlayerOne.x + 1 === coordinatesPlayerTwo.x && coordinatesPlayerOne.y + 1 === coordinatesPlayerTwo.y ||
    coordinatesPlayerOne.x + 1 === coordinatesPlayerTwo.x && coordinatesPlayerOne.y === coordinatesPlayerTwo.y ||
    coordinatesPlayerOne.x + 1 === coordinatesPlayerTwo.x && coordinatesPlayerOne.y - 1 === coordinatesPlayerTwo.y ||
    coordinatesPlayerOne.x === coordinatesPlayerTwo.x && coordinatesPlayerOne.y - 1 === coordinatesPlayerTwo.y;

    summonPlayers = () => {
        let squaresWithPlayerAtTheBeginning = [];
        for(let i = 0; i < 2; i++) {
            let randomSquare = this.getRandomSquare();
            while(randomSquare.grayedOut || randomSquare.hasWeapon || randomSquare.hasPlayer ||
            i === 1 && this.arePlayersSideBySide(squaresWithPlayerAtTheBeginning[0].coordinates, randomSquare.coordinates)) {
                randomSquare = this.getRandomSquare();
            }
            randomSquare.hasPlayer = true;
            squaresWithPlayerAtTheBeginning.push(randomSquare);
        }
        for(let i = 0; i < 2; i++) {
            squaresWithPlayerAtTheBeginning[i].player = this.players[i];
        }
        this.printBoard();
    }

    isWallInRaw = (square, side, i) => side === "top" && square.coordinates.x - i > -1 &&
    this.squares[square.coordinates.x - i][square.coordinates.y].grayedOut ||
    side === "right" && square.coordinates.y + i < this.squares.length &&
    this.squares[square.coordinates.x][square.coordinates.y + i].grayedOut ||
    side === "bottom" && square.coordinates.x + i < this.squares.length &&
    this.squares[square.coordinates.x + i][square.coordinates.y].grayedOut ||
    side === "left" && square.coordinates.y - i > -1 &&
    this.squares[square.coordinates.x][square.coordinates.y - i].grayedOut;

    isPlayerInRaw = (square, side, i) => side === "top" && square.coordinates.x - i > -1 &&
    this.squares[square.coordinates.x - i][square.coordinates.y].hasPlayer ||
    side === "right" && square.coordinates.y + i < this.squares.length &&
    this.squares[square.coordinates.x][square.coordinates.y + i].hasPlayer ||
    side === "bottom" && square.coordinates.x + i < this.squares.length &&
    this.squares[square.coordinates.x + i][square.coordinates.y].hasPlayer ||
    side === "left" && square.coordinates.y - i > -1 &&
    this.squares[square.coordinates.x][square.coordinates.y - i].hasPlayer;

    markARowReachable = (square, side) => {
        for(let i = 1; i < 4; i++) {
            if(this.isWallInRaw(square, side, i) || this.isPlayerInRaw(square, side, i)) {
                break;
            }
            if(side === "top" && square.coordinates.x - i > -1) {
                this.squares[square.coordinates.x - i][square.coordinates.y].reachable = true;
            } else if(side === "right" && square.coordinates.y + i < this.squares.length) {
                this.squares[square.coordinates.x][square.coordinates.y + i].reachable = true;
            } else if(side === "bottom" && square.coordinates.x + i < this.squares.length) {
                this.squares[square.coordinates.x + i][square.coordinates.y].reachable = true;
            } else if(side === "left" && square.coordinates.y - i > - 1) {
                this.squares[square.coordinates.x][square.coordinates.y - i].reachable = true;
            }
        }
    }

    markSquaresReachableByPlayer = (square) => {
        this.markARowReachable(square, "top");
        this.markARowReachable(square, "right");
        this.markARowReachable(square, "bottom");
        this.markARowReachable(square, "left");
    }

    getReachableSquares = () => {
        let reachableSquares = [];
        for(let i = 0; i < this.squares.length; i++) {
            for(let j = 0; j < this.squares[i].length; j++) {
                if(this.squares[i][j].reachable) {
                    reachableSquares.push(this.squares[i][j]);
                }
            }
        }
        return reachableSquares;
    }

    arePlayersAdjacent = (squareOnePlayer) =>
    squareOnePlayer.coordinates.x > 0 && this.squares[squareOnePlayer.coordinates.x - 1][squareOnePlayer.coordinates.y].hasPlayer ||
    squareOnePlayer.coordinates.y < this.squares.length - 1 && this.squares[squareOnePlayer.coordinates.x][squareOnePlayer.coordinates.y + 1].hasPlayer ||
    squareOnePlayer.coordinates.x < this.squares.length - 1 && this.squares[squareOnePlayer.coordinates.x + 1][squareOnePlayer.coordinates.y].hasPlayer ||
    squareOnePlayer.coordinates.y > 0 && this.squares[squareOnePlayer.coordinates.x][squareOnePlayer.coordinates.y - 1].hasPlayer;

    doARound = (squarePlayerWillPlay) => {
        this.markSquaresReachableByPlayer(squarePlayerWillPlay);
        let reachableSquares = this.getReachableSquares();
        for(let reachableSquare of reachableSquares) {
            let lineDiv = "#board div:nth-child(" + (reachableSquare.coordinates.x + 1) + ")";
            $(lineDiv + " picture:nth-child(" + (reachableSquare.coordinates.y + 1) + ") img").addClass("reachable");
        }
        this.currentReachableSquares = $(".reachable");
        this.currentReachableSquares.click(this.movePlayer);
    }

    replaceSiblings = (element, attribute, value) => {
        for(let i = 0; i < $(element).siblings().length; i++) {
            $(element.siblings()[i]).attr(attribute, $(value[i]).attr(attribute));
        }
    }

    changePlayer = () => {
        if(this.currentPlayer.name === "player2") {
            this.currentPlayer = this.players[0];
        } else if(this.currentPlayer.name === "player1") {
            this.currentPlayer = this.players[1];
        }
    }

    changeReachableSquares = () => {
        for(let reachableSquare of this.getReachableSquares()) {
            reachableSquare.reachable = false;
        }
        let reachableSquares = $(".reachable");
        for(let i = 0; i < reachableSquares.length; i++) {
            $(reachableSquares[i]).removeClass("reachable");
        }
    }

    checkWeapons = (square, player) => {
        if(square.hasWeapon) {
            let lastPlayerWeapon = player.weapon;
            player.weapon = square.weapon;
            lastPlayerWeapon.image = lastPlayerWeapon.image;
            square.weapon = lastPlayerWeapon;
        }
    }

    updateWeapon = (square, htmlSquare) => {
        if(square.hasWeapon) {
            htmlSquare.attr("src", "img/" + square.weapon.image);
            $(htmlSquare.siblings()[0]).attr("srcset", "img/mini-" + square.weapon.image);
            $(htmlSquare.siblings()[1]).attr("srcset", "img/medium-" + square.weapon.image);
        }
    }

    changeId = (event) => {
        $("#" + this.currentPlayer.name).removeAttr("id");
        $(event.target).attr("id", this.currentPlayer.name);
    }

    engageBattle = (attacker) => {
        alert("Figth to the death engaged!");
        this.changePlayer();
        new Battle(attacker, this.currentPlayer, this.players[0], this.players[1]);
    }

    movePlayer = (e) => {
        if(!$(e.target).hasClass("reachable")) {
            return;
        }
        let initialSquare = this.squares[$("#" + this.currentPlayer.name).parent().parent().index()]
        [$("#" + this.currentPlayer.name).parent().index()];
        initialSquare.hasPlayer = false;
        $(e.target).attr("src", $("#" + this.currentPlayer.name).attr("src"));
        this.replaceSiblings($(e.target), "srcset", $("#" + this.currentPlayer.name).siblings());
        $("#" + this.currentPlayer.name).attr("src", $($(".empty")[0]).attr("src"));
        this.replaceSiblings($("#" + this.currentPlayer.name), "srcset", $($(".empty")[0]).siblings());
        this.updateWeapon(initialSquare, $("#" + this.currentPlayer.name));
        this.changeId(e);
        this.changeReachableSquares();
        let finalSquare = this.squares[$("#" + this.currentPlayer.name).parent().parent().index()]
        [$("#" + this.currentPlayer.name).parent().index()];
        finalSquare.hasPlayer = true;
        this.checkWeapons(finalSquare, this.currentPlayer);
        if(this.arePlayersAdjacent(finalSquare)) {
            this.engageBattle(this.currentPlayer);
            return;
        }
        this.changePlayer();
        this.doARound(this.squares[$("#" + this.currentPlayer.name).parent().parent().index()]
        [$("#" + this.currentPlayer.name).parent().index()]);
    }
}

new Board(10, 10);