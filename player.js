class Player {
    constructor(name) {
        this.name = name;
        this.lifePoints = 100;
        this.weapon = new Weapon("pistol", "pistol.png", 10);
        this.image = name + ".png";
        this.defenseActivated = false;
    }
}