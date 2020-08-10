class Square {
    constructor(x, y) {
        this.isGrayedOut = false;
        this.hasWeapon = false;
        this.weapon = null;
        this.hasPlayer = false;
        this.player = null;
        this.numberWallsAround = 0;
        this.coordinates = {
            x: x,
            y: y
        }
    }
}