function preload() {
  soundFormats('mp3');
  upbeat = loadSound('assets/music/upbeat.mp3');
  mellow = loadSound('assets/music/mellow.mp3');
  bones = loadSound('assets/music/bones.mp3');
  swoosh = loadSound('assets/music/swoosh.mp3');
  axe = loadSound('assets/music/axe.mp3');
  thump = loadSound('assets/music/thump.mp3');
  background1 = loadImage('assets/pixelartcity.png');
  fnt = loadFont('assets/Prstart.ttf');
}

function setup() {
  character = new Entity(75,0,[['assets/advent/run.png',150,111,6], ['assets/advent/jump.png',150,111,4],
  ['assets/advent/attack.png',150,111,4],
  ['assets/advent/somer.png',150,111,4],
  ['assets/advent/death.png',150,111,7],
  ['assets/advent/idle.png',150,111,4]],['rectangle',0,15,60,80],updtChar,100);
  character.sprite.animation.frameDelay = 5;
  enemies = new enemyGroup(character);
  obstacles = new obstGroup(character, enemies);
  dead = false;
  amountLives = 2;
  lastCheckpoint = 75;
  killCount = 0;
  generate();
  upbeat.play();
  upbeat.setLoop(true);
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  textFont(fnt);
  backgroundWidth = width;
  lastX = 0;
  ground = new Obstacle(0,height+1,['rectangle',0,0,1000000,1]);
  obstacles.addObst(ground.obst);
  leftEdge = new Obstacle(-10,0,['rectangle',0,0,20,height * 2]);
  obstacles.addObst(leftEdge.obst);
  wordsPosX = width - 50;
  endState = 0;
  noSmooth();
  genPlatforms();
}

function updtChar() {
  if (character.sprite.position.x >= width / 4) {
    wordsPosX = character.sprite.position.x + width - width/4 - 50;
  }
  if (!dead) {
    movePlayer();
    character.sprite.position.x += character.xspd;
    character.xspd *= 0.95; //FRICTION
  }

  character.sprite.position.y += character.yspd;
  character.yspd += 1;

  enemies.update();

  obstacles.update();
  /*character.sprite.overlap(firstNotePaper.obst, () => {
    notesSeen.first = true;
    lastCheckpoint = firstNotePaper.obst.position.x;
  }); */

  if (!dead) {
    if (character.attCounter == 10) {
      swoosh.play();
      character.sprite.changeAnimation('animation2');
      character.sprite.animation.looping = false;
      character.sprite.animation.rewind();
      character.attCounter--;

      for (var i = 0; i < enemies.g.length; i++) {
        enemies.g[i].gotHit = false;
      }
    } else if (character.attCounter > 0) {
      character.sprite.changeAnimation('animation2');
      character.attCounter--;
    }

    if (character.attDelay > 0) {
      character.attDelay--;
    }

    if (character.hp == 0) {
      character.sprite.changeAnimation('animation4');
      character.sprite.animation.rewind();
      character.sprite.animation.looping = false;
      dead = true;
      amountLives--;
      if (amountLives == 0) {
        upbeat.setLoop(false);
        upbeat.pause();
        upbeat.stop();
        mellow.play();
        clearInterval(generateInt);
        creditsInt = setInterval(() => {
          endState++;
        },2000);
      } else {
        thump.play();
        setTimeout(() => {
          character.sprite.position.y = height-character.sprite.height/2;
          character.hp = 100;
          dead = false;
      }, 3000);
      }
    }
  }
}

function keyPressed() {
  if (!dead && (keyCode == 87 || keyCode == 32 || keyCode == 38) && character.jumpCount < 2) {
    character.yspd = -17;
    if (character.jumpCount == 0) {
      this.character.sprite.changeAnimation('animation1'); //jump
      this.character.sprite.animation.rewind();
      character.sprite.animation.looping = false;
    } else {
      this.character.sprite.changeAnimation('animation3'); //somer
      this.character.sprite.animation.rewind();
    }

    character.jumpCount++;
  }
  if ((keyCode == 74) && character.attDelay == 0) {
    character.attCounter = 10;
    character.attDelay = 20;
  }
}

function mouseClicked() {
 if (character.attDelay == 0) {
    character.attCounter = 10;
    character.attDelay = 20;
  }
}

function movePlayer() { //Get keycodes from keycode.info website
  if (keyIsDown(65) || keyIsDown(37)) { //Move Left
    character.xspd = -7;
    character.sprite.mirrorX(-1);
  }
  if (keyIsDown(68) || keyIsDown(39)) { //Move Right
    character.xspd = 7;
    character.sprite.mirrorX(1);
  }
  if (keyIsDown(83) || keyIsDown(40)) {
    character.yspd += 1.5;
  }
  if ((keyIsDown(65) || keyIsDown(37)) && (keyIsDown(68) || keyIsDown(39))) {
    character.xspd = 0;
  }
}

function draw() {
  character.update();
  background(51);
  if (character.sprite.position.x > lastX + (windowWidth*1/2)) {
    lastX += windowWidth;
    genPlatforms();
  }

  if (amountLives > 0) {
    background1.resize(windowWidth, windowHeight);
    scroll();
    obstacles.draw();
    character.draw();
    enemies.draw();
    //if (notesSeen.first) firstNote.draw();
    //if (!notesSeen.first) firstNotePaper.draw();
    fill(255);
    textSize(36);
    textAlign(RIGHT, CENTER);
    text("Health: " + character.hp,wordsPosX,height - 50);
    text("Kills: " + killCount,wordsPosX,50);
    text("Lives: " + amountLives,wordsPosX,100);
  } else {
    upbeat.setLoop(true);
    upbeat.pause();
    upbeat.stop();
    showText();
  }
}

function showText() {
  upbeat.setLoop(true);
  upbeat.pause();
  upbeat.stop();
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(255);
  if (endState == 0) {
    text("Your score was: " + killCount,width/2, height - 40);
    textSize(60);
    camera.position.x = width/2;
    camera.position.y = height/2;
    text("Game Over!",width/2,height/2-60);
  } else if (endState == 1) {
    text("Aaryan Agrawal (game design)",width/2, height/2-30);
    text("Your score was: " + killCount,width/2, height - 40);
  } else if (endState == 2) {
    text("Tomer Sedan (game design + art)",width/2, height/2-30);
    text("Your score was: " + killCount,width/2, height - 40);
  } else if (endState == 3) {
    text("Guy Ben Zeev (sound design)",width/2, height/2-30);
    text("Your score was: " + killCount,width/2, height - 40);
  } else if (endState == 4) {
    text(".",width/2, height/2-30);
  } else if (endState == 5) {
    text("..",width/2, height/2-30);
  } else {
    clearInterval(creditsInt);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 200; i++) {
      for (let j = 0; j < 200; j++) {
        text("YEET!",i*160,j*40);
      }
    }
  }
}

function scroll() {
  if (character.sprite.position.x >= width / 4) { //BEGIN SCROLL ONCE REACHES QUARTER OF WIDTH.
    camera.position.x = character.sprite.position.x + width / 4;
  } else {
    camera.position.x = width / 2;
  }
  image(background1, backgroundWidth, 0);
  image(background1, backgroundWidth-windowWidth, 0);
  image(background1, backgroundWidth-(2*windowWidth), 0);

  if (backgroundWidth - character.sprite.position.x <= windowWidth/2) {
    backgroundWidth += windowWidth;
  }

  if (backgroundWidth - windowWidth > character.sprite.position.x) {
    backgroundWidth -= windowWidth;
  }
}

function generate() {
  count = 0;
  generateInt = setInterval(() => {
    count++;
    for (var i = 0; i < Math.floor(Math.sqrt(count / 3)); i++) {
      const randX = Math.random() * width + character.sprite.position.x;
      enemies.addEnemy(new Enemy(randX,10000,500,count,character,8,10+count*2));
    }
  },5000);
}

function genPlatforms() {
  numPlatforms = Math.round(Math.random() + 1);
  let randY = (Math.random() * windowHeight * 4.75/6) + (windowHeight / 5.5);
  let randX = (Math.random() * windowWidth) + lastX;
  let len = (Math.floor(Math.random() * 3) + 1) * 160;
  obstacles.addObst((new Obstacle(randX,randY,['rectangle',0,0,len,56], ['assets/platforms/'+len+'.png',len,56,1])).obst);
  enemies.addEnemy(new Enemy(randX,len/2,randY-100,10,character,4,30));

  randY = (Math.random() * windowHeight * 1/3) + (windowHeight / 3);
  randX = Math.random() * windowWidth + lastX;
  len = (Math.floor(Math.random() * 3) + 1) * 160;
  obstacles.addObst((new Obstacle(randX,randY,['rectangle',0,0,len,56], ['assets/platforms/'+len+'.png',len,56,1])).obst);
  enemies.addEnemy(new Enemy(randX,len/2,randY-100,10,character,4,30));
}
