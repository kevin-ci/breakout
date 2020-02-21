var _CANVAS_WIDTH = 1280;
var _CANVAS_HEIGHT = 720;

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.addEventListener('keydown', keyDown);

let blockMap = [
    ["1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1"]
]

function Paddle(x, y, width, height, drawColor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.drawColor = drawColor;
    this.movementSpeed = 15;

    this.moveRight = function () {
        if (this.x + this.width < _CANVAS_WIDTH - this.movementSpeed) {
            this.x += this.movementSpeed;
        }
    }

    this.moveLeft = function () {
        if (this.x > this.movementSpeed) {
            this.x -= this.movementSpeed;
        }
    }

    this.draw = function () {
        context.strokeStyle = drawColor;
        context.beginPath()
        context.rect(this.x, this.y, this.width, this.height);
        context.stroke();
    }
}

let player = new Paddle(590, 650, 100, 20, "#FFF");
player.draw(context);

function Ball(x, y, sideLength, initialSpeed, drawColor) {
    this.x = x;
    this.y = y;
    this.sideLength = sideLength;
    this.drawColor = drawColor;
    this.speedX = initialSpeed;
    this.speedY = initialSpeed;

    this.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x <= 0 ||
            this.x + this.sideLength >= _CANVAS_WIDTH) {
            this.speedX *= -1;
        }
        if (this.y <= 0) {
            this.speedY *= -1;
        }
    }

    this.draw = function () {
        context.fillStyle = drawColor;
        context.fillRect(this.x, this.y, this.sideLength, this.sideLength);
        context.stroke();
    }
}

let ball = new Ball(640, 600, 30, -5.0, "#FFF");

function Block(x, y, width, height, active) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.drawColor = "#FFF";
    this.active = active;

    this.draw = function () {
        context.fillStyle = this.drawColor;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.stroke();
    }
}

let blockArray = [];

for (let i = 0; i < 5; i++) {
    let tempArray = [];
    for (let j = 0; j < 5; j++) {
        let type = blockMap[j][i];
        if (type != 0) {
            tempArray.push(new Block((i * 251) + 5, (j * 30) + 5, 246, 25, true, type));
        } else {
            tempArray.push(new Block((i * 251) + 5, (j * 30) + 5, 246, 25, true, type));
        }
    }
    blockArray.push(tempArray);
}

function clear() {
    context.clearRect(0, 0, _CANVAS_WIDTH, _CANVAS_HEIGHT);
}

function keyDown(e) {
    if (e.keyCode == 37) {
        player.moveLeft();
    }

    if (e.keyCode == 39) {
        player.moveRight();
    }
}

function rectangleOnRectangleCollision(rect1X, rect1Y, rect1Width, rect1Height, rect2X, rect2Y, rect2Width, rect2Height, type) {
    // check for collision
    if (rect1X < rect2X + rect2Width &&
        rect1X + rect1Width > rect2X &&
        rect1Y < rect2Y + rect2Height &&
        rect1Y + rect1Height > rect2Y) {

        // if true, hit was from above
        if (rect1Y <= rect2Y + (rect2Height / 2)) {
            if (type == "paddle") {
                let rand = Math.floor((Math.random() * 5) + 1);
                if (rect1X >= rect2X + (rect2Width / 2)) {
                    ball.speedX = rand;
                } else {
                    ball.speedX = -rand;
                }
            }
            ball.speedY *= -1;
            return true;
        }

        // if true, hit was from below
        if (rect1Y >= rect2Y - (rect2Height / 2)) {
            ball.speedY *= -1;
            return true;
        }

        // if true, hit was from either left or right
        if (rect1X < rect2X || rect1X > rect2X) {
            ball.speedX *= -1;
            return true;
        }
        return false;
    }
}

function checkCollisions() {
    rectangleOnRectangleCollision(ball.x, ball.y, ball.sideLength, ball.sideLength, player.x, player.y, player.width, player.height, "paddle");
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (blockArray[i][j].active) {
                if (rectangleOnRectangleCollision(ball.x, ball.y, ball.sideLength, ball.sideLength, blockArray[i][j].x, blockArray[i][j].y, blockArray[i][j].width, blockArray[i][j].height, "block")) {
                    blockArray[i][j].active = false;
                }
            }
        }
    }
}

function updateWorld() {
    clear();
    checkCollisions();
    ball.update();
    ball.draw();
    player.draw();
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (blockArray[i][j].active) {
                blockArray[i][j].draw();
            }
        }
    }
}

let updateLoop = setInterval(updateWorld, 16);