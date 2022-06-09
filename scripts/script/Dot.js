class Dot extends Phaser.GameObjects.Sprite {
    constructor(scene, dot) {
        super(scene, dot.x, dot.y, dot.color);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setInteractive();
        this.on('pointerdown', this.click, this);
    }
    click() {
        console.log(this , "da");
    }
}