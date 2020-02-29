class enemyGroup {
  constructor(character) {
    this.char = character;
    this.g = [];
  }
  addEnemy(enemy) {
    this.g.push(enemy);
  }

  draw() {
    for (var i = 0; i < this.g.length; i++) {
      this.g[i].draw();
    }
  }

  update() {
    for (let i = 0; i < this.g.length; i++) {
      if (this.g[i].ent.sprite.position.x <= this.char.sprite.position.x + windowWidth && this.g[i].ent.sprite.position.x >= this.char.sprite.position.x - (windowWidth/4)) {
        this.g[i].update();
      }
    }
  } 
}