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
            [{color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0},
            {color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0}],
            [{color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0},
            {color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0}],
            [{color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0},
            {color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0}],
            [{color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0},
            {color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0}],
            [{color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0},
            {color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0}],
            [{color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0},
            {color:0,width:0,height:0},{color:0,width:0,height:0},{color:0,width:0,height:0}]
        ],
        this.memoryDict = [];
        this.click = false;
        this.dots = [];
        this.lines = [];
    }
    
    create() {
        this.createTable();
        this.createDots();
    }
    
    pledge() {
        if(this.memoryDict.length < 1) return;
            this.memoryDict.forEach(item => {
            this.table[item.y][item.x].color = 9;
            this.score++;
        });
        console.log(this.score);
        for(let x = 0; x < this.table.length; x++) {
            while(true) {
                //find hole
                let hole = -1;
                for(let y = this.table.length-1; y >= 0; y--) {
                    if(this.table[y][x].color === 9) {
                        hole = y;
                        break;
                    }
                }
                if(hole < 0) {
                    break;
                }
                //find ball
                let ball = -1;
                for(let y = hole-1; y >= 0; y--) {
                    if(this.table[y][x].color !== 9){
                        ball = y;
                        break;
                    }
                }
                if(ball < 0) {
                    break;
                }
                //move ball into hole
                this.table[hole][x].color = this.table[ball][x].color;
                this.table[ball][x].color = 9;
            }
            //randomize ramaining holes
            for(let y = 0; y < this.table.length && this.table[y][x].color === 9; y++) {
                this.table[y][x].color = Phaser.Math.Between(0, 4);
            }
        }
        this.memoryDict = [];
        this.dots.forEach(item => {item.destroy()});
        this.lines.forEach(item => {item.destroy()});
        this.dots = [];
        this.createDots();
    }
    
    createTable() {
        for(let i = 0; i < this.table.length; i++){
            for(let j = 0; j < this.table[i].length; j++){
                this.table[i][j].color = Phaser.Math.Between(0, 4);
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
            let checkX2 = this.memoryDict[this.memoryDict.length-1].x;
            let checkY2 = this.memoryDict[this.memoryDict.length-1].y;
            let check = (this.table[i][j].color === this.table[checkY][checkX].color);
            let checkRow = (checkX === checkX2 && checkY === checkY2-1);
            let checkRow2 = (checkX === checkX2 && checkY === checkY2+1);
            let checkRow3 = (checkX === checkX2-1 && checkY === checkY2);
            let checkRow4 = (checkX === checkX2+1 && checkY === checkY2);
            if(this.memoryDict.length >= 2){
                checkX = this.memoryDict[this.memoryDict.length-2].x;
                checkY = this.memoryDict[this.memoryDict.length-2].y;
                console.log([checkRow, checkRow2, checkRow3, checkRow4]);
                console.log([this.memoryDict[this.memoryDict.length-1],this.memoryDict[this.memoryDict.length-2]]);
            }
            if(check){// && (checkRow || checkRow2 || checkRow3 || checkRow4)
                this.memoryDict.push({x: j, y: i});
                this.drawLine();
            }else if(!check){// || !(checkRow || checkRow2 || checkRow3 || checkRow4)
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
                .fillStyle(this.tableColors[this.table[i][j].color])
                .fillCircle(width,  height, 10);
                dot.on("pointerdown", () => { this.onDotsClicked(i,j) });
                dot.on("pointerover", () => { this.onDotsOver(i,j) });
                this.dots.push(dot);
                this.table[i][j].width = width;
                this.table[i][j].height = height;
            }
        }
        this.input.on("pointerup", () => { this.onDotsUp(undefined,undefined) });
    }

    drawLine() {
        let firstCoordinates = this.memoryDict[this.memoryDict.length-1];
        let secondCoordinates = this.memoryDict[this.memoryDict.length-2];
        let color = this.tableColors[this.table[firstCoordinates.y][firstCoordinates.x].color];
        let widthStart = this.table[firstCoordinates.y][firstCoordinates.x].width;
        let heighStart = this.table[firstCoordinates.y][firstCoordinates.x].height;
        let widthEnd = this.table[secondCoordinates.y][secondCoordinates.x].width;
        let heightEnd = this.table[secondCoordinates.y][secondCoordinates.x].height;
        let graphics = this.add.graphics();
        graphics.lineStyle(20, color, 1.0)
            .beginPath()
            .moveTo(widthStart, heighStart)
            .lineTo(widthEnd, heightEnd)
            .closePath()
            .strokePath();
        this.lines.push(graphics);
    }
    
}