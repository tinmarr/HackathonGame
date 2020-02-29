class Obstacle {
  constructor(x,y,collider,image) {
    this.obst = createSprite(x,y,collider[3],collider[4]); //Create a sprite for the obstacle
    this.obst.setCollider(...collider); //Set its collider
    if (image != undefined) {
      const img = loadSpriteSheet(...image);
      loadAnimation(img);
      this.obst.addAnimation("Image", img);
    }
    //this.obst.debug = true;
  }

  draw() {
    drawSprite(this.obst);
  }
}