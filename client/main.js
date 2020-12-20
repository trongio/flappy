class Flappy {
    constructor(GameArea) {
        this.GamePiece = new component(30, 30, "/img/birddown.png", 50, 100,"image",-0.05);
        this.Obstacles = []
        this.myObstacle = new component(10, 200, "green", 300, 120,null,null);
        if(window.innerWidth>480)
            this.Score = new component("30px", "Consolas", "black", 280, 40, "text",null);
        else
            this.Score = new component("30px", "Consolas", "black", window.innerWidth-200, 40, "text",null);
        this.Background = new component(656, 270, "/img/background.png", 0, 0, "background",0);
    }
}

class GameArea{
    constructor() {
        this.frameNo=0;
        this.canvas = document.createElement("canvas")
        this.flappy =new Flappy(this);
    }

    start(){
        if(window.innerWidth>480)
            this.canvas.width = 480;
        else this.canvas.width = window.innerWidth;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(this.update(), 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })

        window.addEventListener('touchstart', function (e) {
            myGameArea.key = 38;
        })
        window.addEventListener('touchend', function (e) {
            myGameArea.key = false;
        })
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stop() {
        clearInterval(this.interval);
    }

    update() {
        var x, y;
        for (let i = 0; i < this.flappy.Obstacles.length; i += 1) {
            if (this.flappy.GamePiece.crashWith(this.flappy.Obstacles[i])) {

                document.body.append(restartBtn);

                this.stop();
                return;
            }
        }
        this.flappy.GamePiece.speedX = 0;
        this.flappy.GamePiece.speedY = 0;
        if (this.key && this.key == 38) {
            this.flappy.GamePiece.image.src = "/img/birdup2.png";
            this.flappy.GamePiece.gravity=-0.2;
        } else {
            this.flappy.GamePiece.image.src = "/img/birddown.png";
            this.flappy.GamePiece.gravity=0.1;
        }
        this.clear();
        this.frameNo += 1;
        if (this.frameNo == 1 || everyinterval(150)) {
            x = this.canvas.width;
            this.minHeight = 30;
            this.maxHeight = 200;
            this.height = Math.floor(Math.random()*(this.maxHeight-this.minHeight+1)+this.minHeight);
            this.minGap = 50;
            this.maxGap = 200-(this.frameNo/10);
            if(this.maxGap<50) this.maxGap=50;
            this.gap = Math.floor(Math.random()*(this.maxGap-this.minGap+1)+this.minGap);
            this.flappy.Obstacles.push(new component(10, this.height, "green", x, 0));
            this.flappy.Obstacles.push(new component(10, x - this.height - this.gap, "green", x, this.height + this.gap));
        }
        this.flappy.Background.speedX = -1;
        this.flappy.Background.newPos();
        this.flappy.Background.update();

        if(this.flappy.Obstacles[0].x<-20) this.flappy.Obstacles.shift();

        for (let i = 0; i < this.flappy.Obstacles.length; i += 1) {
            this.flappy.Obstacles[i].x += -1;
            this.flappy.Obstacles[i].update();
        }
        this.flappy.Score.text = "SCORE: " + myGameArea.frameNo;
        this.flappy.Score.update();
        this.flappy.GamePiece.newPos();
        this.flappy.GamePiece.update();
    }
}

class component{
    constructor(width, height, color, x, y, type='',gravity=null){

        this.type = type;
        this.color=color;
        if (this.type == "image" || this.type == "background") {
            if(this.type=="image") this.bounce = 0.6;
            this.image = new Image();
            this.image.src = this.color;
        }
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.gravity = gravity;
        this.gravitySpeed = 0;
        this.ctx=null
    }

    update () {
        this.ctx = myGameArea.context;
        if (this.type == "image" || this.type == "background") {
            this.ctx.drawImage(this.image,this.x,this.y,this.width, this.height);
            if (this.type == "background") {
                this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        } else {
            if (this.type == "text") {
                this.ctx.font = this.width + " " + this.height;
                this.ctx.fillStyle = this.color;
                this.ctx.fillText(this.text, this.x, this.y);
            }
            else {
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }

    newPos () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hittop();
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }

    hittop () {
        var alltop = 0;
        if (this.y < alltop) {
            this.y = alltop;
            this.gravitySpeed = 0;
        }
    }

    hitBottom () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }


    crashWith (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom-4 < othertop) ||
            (mytop+4 > otherbottom) ||
            (myright-5 < otherleft) ||
            (myleft+5 > otherright)) {
            crash = false;
        }
        return crash;
    }
}


let myGameArea = new GameArea();
function startGame() {

    myGameArea.start();

}


function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}




let restartBtn = document.createElement('button');
restartBtn.classList.add('btn');
restartBtn.classList.add('btn-primary');
restartBtn.id = 'restart';
restartBtn.innerHTML = 'Restart';

restartBtn.addEventListener('click', ev => {
    location.reload();
})