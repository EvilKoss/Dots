class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('violet' , 'sprites/violetDot.png');
        this.load.image('blue' , 'sprites/blueDot.png');
        this.load.image('yellow' , 'sprites/yellowDot.png');
        this.load.image('red' , 'sprites/redDot.png');
        this.load.image('green' , 'sprites/greenDot.png');
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.score = 0;
        this.violet2 = {color:0xFF00FF, name:'violet'};
        this.violet = 0xFF00FF;
        this.red = 0xff0000;
        this.green = 0x66ff66;
        this.yellow = 0xffff4d;
        this.blue = 0x0040ff;
        this.tableColors = [this.violet,this.red,this.green,this.yellow,this.blue];
        this.table = [
            [0,1,2,3,4,0],
            [0,1,2,3,4,0],
            [0,1,2,3,4,0],
            [0,1,2,3,4,0],
            [0,1,2,3,4,0],
            [0,1,2,3,4,0]
        ],
        this.memoryDict = [];
        this.click = false;
        this.dots = [];
    }
    
    create() {
        this.createTable();
        this.createDots();
    }

    pledge() {
        if(this.memoryDict.length > 1){
            let column = this.table.length -1;
            this.memoryDict.forEach(item => {
                this.table[item.y][item.x] = 9;
                this.score++;
            });
            console.log(this.score);
            while(column >= 0){
                let i = this.table.length -1;
                while(i >= 0){
                    let j = i;
                    while(j >= 0 && this.table[j][column] === 9 && j >= 0){
                        j--;
                        if(j === 0 && this.table[j][column] === 9){
                            while(this.table[j][column] === 9){
                                this.table[j][column] = Phaser.Math.Between(0, 4);
                                j++;
                            }
                            break;
                        }
                    };
                    if(j >= 0 && this.table[i][column] === 9 && this.table[j][column] != 9){
                        this.table[i][column] = this.table[j][column];
                        this.table[j][column] = 9;
                    }else if(this.table[i][column] === 9 && i === 0){
                        this.table[i][column] = Phaser.Math.Between(0, 4);
                    }
                    i--;
                };
                column--;
            }
    
            this.memoryDict = [];
            this.dots.forEach(item => {item.destroy()});
            this.dots = [];
            this.createDots();
        }else{return}
    }

    createTable() {
        for(let i = 0; i < this.table.length; i++){
            for(let j = 0; j < this.table[i].length; j++){
                this.table[i][j] = Phaser.Math.Between(0, 4);
            }
        }
    }

    onDotsClicked(i,j) {
        this.click = true;
        this.memoryDict = [{x: j, y: i}];
    }

    onDotsOver(i,j) {
        if(this.click === true){
            let checkX = this.memoryDict[0].x;
            let checkY = this.memoryDict[0].y;
            let check = (this.table[i][j] === this.table[checkY][checkX]);
            if(check){
                this.memoryDict.push({x: j, y: i});
            }else if(!check){
                this.memoryDict = [];
            }
        }
    }

    onDotsUp() {
        this.click = false;
        this.pledge();
    }

    createDots() {
        for(let i = 0; i < this.table.length; i++){
            for(let j = 0; j < this.table[i].length; j++){
                let width = config.width / 2 + (50 * j - 150);
                let height = config.height / 2 + (50 * i - 150);
                const dot = this.add.graphics()
                    .setInteractive(new Phaser.Geom.Circle(width,  height, 10), Phaser.Geom.Circle.Contains)
                    .fillStyle(this.tableColors[this.table[i][j]])
                    .fillCircle(width,  height, 10);
                dot.on("pointerdown", () => { this.onDotsClicked(i,j) });
                dot.on("pointerover", () => { this.onDotsOver(i,j) });
                this.dots.push(dot);
            }
        }
        this.input.on("pointerup", () => { this.onDotsUp(undefined,undefined) });
    }

}