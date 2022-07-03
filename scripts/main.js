//import Phaser from "phaser";
let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: new GameScene()
    //Phaser: Phaser()
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         debug: false
    //     }
    // }
}

let game = new Phaser.Game(config);