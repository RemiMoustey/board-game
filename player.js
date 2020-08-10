class Player {
    constructor(image) {
        this.lifePoints = 100;
        this.weapon = new Weapon("pistol", "img/pistol.png", 10);
        this.image = image;
    }
}