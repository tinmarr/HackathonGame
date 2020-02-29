class obstGroup {
  constructor(character, enemies) {
    this.char = character;
    this.enemies = enemies;
    this.g = new Group();
  }
  
  addObst(sprite) {
    this.g.add(sprite);
  }

  draw() {
    this.g.draw();
  }

  update() {
    this.char.sprite.collide(this.g, ()=> {
      if (this.char.sprite.touching.bottom) {
        if (!dead) {
          if (this.char.xspd != 0) {
            this.char.sprite.changeAnimation('animation0');
          } else {
            this.char.sprite.changeAnimation('animation5');
          }
        }
        this.char.yspd = 0;
        this.char.xspd = 0;
        this.char.jumpCount = 0;
      }
      if (this.char.sprite.touching.left || this.char.sprite.touching.right) {
        this.char.xspd = 0;
      }
    });

    for (var i = 0; i < this.enemies.g.length; i++) {
      this.enemies.g[i].ent.sprite.collide(this.g, ()=> {
        if (this.enemies.g[i].ent.sprite.touching.bottom) {
          this.enemies.g[i].ent.yspd = 0;
        }
        if (this.enemies.g[i].ent.sprite.touching.left ||   this.enemies.g[i].ent.sprite.touching.right) {
          this.enemies.g[i].ent.xspd = 0;
        }
      });
    }
    
  }
}