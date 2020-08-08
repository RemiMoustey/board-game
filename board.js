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
        if(!isNaN(numberWalls) && numberWalls >= 8 && numberWalls <= 14) {
            for(let i = 0; i < numberWalls; i++) {
                this.grayOverOneSquare(this.getRandomRaw(), this.getRandomRaw());
            }
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
}

let board = new Board();