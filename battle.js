class Battle {
    constructor(firstPlayer, otherPlayer, playerOne, playerTwo) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.attacker = firstPlayer;
        this.attacked = otherPlayer;
        $("#buttons-battle").css({display: "block"});
        $("#players").css({display: "block"});
        this.updateBoards(this.playerOne);
        this.updateBoards(this.playerTwo);
        this.updateTurn();
        this.doABattleRound();
    }

    updateTurn = () => {
        $("#turn-" + this.attacker.name).text("It's your turn!");
        $("#turn-" + this.attacked.name).text("");
    }

    doABattleRound = () => {
        $("#attack-button").click(this.attack);
        $("#defense-button").click(this.defend);
    }

    changeAttacker = () => {
        let newAttacked = this.attacker;
        this.attacker = this.attacked;
        this.attacked = newAttacked;
    }

    attack = () => {
        if(this.attacked.defenseActivated) {
            this.attacked.lifePoints -= this.attacker.weapon.damage / 2;
        } else {
            this.attacked.lifePoints -= this.attacker.weapon.damage;
        }
        if(this.attacked.lifePoints <= 0) {
            this.endBattle();
            return;
        }
        this.attacked.defenseActivated = false;
        this.updatAfterTurn();
    }

    updatAfterTurn = () => {
        this.updateBoards(this.attacker);
        this.updateBoards(this.attacked);
        this.changeAttacker();
        this.updateTurn();
    }

    defend = () => {
        this.attacker.defenseActivated = true;
        this.updatAfterTurn();
    }

    updateBoards = (player) => {
        $("#lifePoints-" + player.name).text(player.lifePoints);
        $("#weapon-" + player.name).text(player.weapon.name.charAt(0).toUpperCase() + player.weapon.name.slice(1));
        if(player.defenseActivated) {
            $("#defense-" + player.name).text("Yes");
        } else {
            $("#defense-" + player.name).text("No");
        }
    }

    endBattle = () => {
        $("#board").html("");
        $("#buttons-battle").html("");
        $("#players").html("");
        $("#ending-message").text("The fight is ended : " + this.attacker.name.substring(0, 6) + " " + this.attacker.name.substring(6, 7) + " won!");
    }
}