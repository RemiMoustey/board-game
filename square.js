class Square {
    constructor(x, y) {
        this.grayedOut = false;
        this.hasWeapon = false;
        this.weapon = null;
        this.hasPlayer = false;
        this.player = null;
        this.numberWallsAround = 0;
        this.reachable = false;
        this.coordinates = {
            x: x,
            y: y
        }
    }
}