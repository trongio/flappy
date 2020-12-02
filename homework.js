// ========================================================
// Understand how this game works and write on your own
// https://www.w3schools.com/graphics/game_intro.asp
// ========================================================


var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;

function startGame() {
  myGameArea.start();
  myBackground = new component(656, 270, "background.png", 0, 0, "background",0);
  myScore = new component("30px", "Consolas", "black", 280, 40, "text");
  myGamePiece = new component(30, 30, "birddown.png", 50, 100,"image",-0.05);
  myObstacle = new component(10, 200, "green", 300, 120);
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;  
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function (e) {
        myGameArea.key = e.keyCode;
      })
      window.addEventListener('keyup', function (e) {
        myGameArea.key = false;
      })
  },

  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  stop : function() {
    clearInterval(this.interval);
  }
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function component(width, height, color, x, y, type,gravity) {
    this.type = type;
    if (type == "image" || type == "background") {
        if(type=="image") this.bounce = 0.6;
        this.image = new Image();
        this.image.src = color;
      }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = gravity;
    this.gravitySpeed = 0;
    this.update = function() {
      ctx = myGameArea.context;
      if (type == "image" || type == "background") {
        ctx.drawImage(this.image,this.x,this.y,this.width, this.height);
        if (type == "background") {
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
          }
      } else {
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      }
        
    }
    this.newPos = function() {
      this.gravitySpeed += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY + this.gravitySpeed;
      this.hitBottom();
      if (this.type == "background") {
        if (this.x == -(this.width)) {
          this.x = 0;
        }
      }
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
          this.y = rockbottom;
          this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
      }


    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false;
        }
        return crash;
      }
  }



  function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
        myGameArea.stop();
        return;
      }
    }
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 38) {
        myGamePiece.image.src = "birdup2.png";
        myGamePiece.gravity=-0.2;
    } else {
        myGamePiece.image.src = "birddown.png";
        myGamePiece.gravity=0.1;
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 30;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200-(myGameArea.frameNo/10);
        if(maxGap<50) maxGap=50;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
      }
      myBackground.speedX = -1;
      myBackground.newPos();
      myBackground.update();
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -1;
      myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
  }