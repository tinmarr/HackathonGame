class Enemy {
  constructor (x,endX,y,dmg,character, maxSpeed, hp) {
    this.ent = new Entity(x, y,[['assets/skeleton/attack.png',130,111,18], ['assets/skeleton/walk.png',74,111,13],
    ['assets/skeleton/dead.png',115,111,15],['assets/skeleton/hit.png',104,111,8]],['rectangle',0,5,100,100],()=>{},hp)
    this.dmg = dmg;
    this.alreadyHit = false;
    this.gotHit = false;
    this.startX = x;
    this.endX = endX;
    this.char = character;
    this.maxSpeed = maxSpeed;
    this.gavePoints = false;
    this.ouchCount = 0;
  }

  draw() {
    this.ent.draw();
  }
  
  update() {
    if (this.ent.hp > 0) {
      if (this.ent.sprite.position.x < (this.startX - this.endX) + 50) {
        this.ent.xspd = 5;
      } else if (this.ent.sprite.position.x > (this.startX + this.endX) - 50) {
        this.ent.xspd = -5;
      } else {
        if (this.ent.sprite.position.x < this.char.sprite.position.x) {
          this.ent.xspd = Math.min(this.ent.xspd + 0.4,this.maxSpeed);
        } else if (this.ent.sprite.position.x >= this.char.sprite.position.x) {
          this.ent.xspd = Math.max(this.ent.xspd - 0.4,-(this.maxSpeed));
        }
      }

      this.ent.xspd < 0 ? this.ent.sprite.mirrorX(-1) : this.ent.sprite.mirrorX(1);

      this.ent.sprite.position.y += this.ent.yspd;
      this.ent.sprite.position.x += this.ent.xspd;

      this.ent.yspd += 1; //GRAVITY
      //hitting the player
      this.char.sprite.overlap(this.ent.sprite, ()=> {
        if (this.ent.sprite.animation.getFrame() == 8 &&!this.alreadyHit) {
          this.alreadyHit = true;
          if (amountLives != 0) axe.play();
          this.char.hit(this.dmg);
        }

        if (this.char.attCounter > 0 && !this.gotHit) {
          this.ent.hit(10);
          this.gotHit = true;
          this.ouchCount = 5;
        }
      });



      var leftEdge = this.ent.sprite.width / 2;
      if (this.ent.sprite.position.x <= leftEdge) {
        this.ent.xspd = 0;
        this.ent.sprite.position.x = leftEdge;
      }

      //change animations
      const distanceToPlayer = this.ent.sprite.position.x - this.char.sprite.position.x;
      if (this.gotHit && this.ouchCount > 0) {
        this.ent.sprite.changeAnimation('animation3');
        console.log(this.ent.sprite.getAnimationLabel());
        this.ent.sprite.animation.looping = false;
        if (this.alreadyHit && this.ent.sprite.animation.getFrame() <= 1) {
          this.alreadyHit = false;
        }
        this.ouchCount--;
      } else {
        if (Math.abs(distanceToPlayer) < this.ent.sprite.width*2) {
          if (this.ent.sprite.getAnimationLabel() != 'animation0') {
            this.ent.sprite.changeAnimation('animation0');
            this.ent.sprite.animation.rewind();
          }
          if (this.alreadyHit && this.ent.sprite.animation.getFrame() <= 1) {
            this.alreadyHit = false;
          }
        } else {
          this.ent.sprite.changeAnimation('animation1'); //walking
        }
      }
    } else {
      this.ent.sprite.changeAnimation('animation2'); //death
      this.ent.sprite.animation.looping = false;
      if (!this.gavePoints) {
        this.gavePoints = true;
        killCount++;
        setTimeout(() => {
          bones.play();
        }, 1000);
      }
    }
  }
}