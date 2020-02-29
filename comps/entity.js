/* OVERVIEW
  The entity should have update() and draw() called on it every frame.

  The sprite is a p5play sprite object
  The collider should generally be a rectangle
  
  The hit function can be used to hit the sprite, or determine whether it is alive by calling hit(). It returns whether the entity is alive
*/

class Entity {
  constructor(x,y,animations,collider,update,hp) {
    //Create the main sprite
    //50,50 is just a way to create a rectangle
    //It doesn't affect the collider and isn't shown if animations are specified
    this.sprite = createSprite(x,y,50,50);
    //Load the main sprite's animations
    this.loadAnims(animations);
    //Set the main sprite's collider
    //generally: collider = ['rectangle',0,0,width,height];
    this.sprite.setCollider(...collider);
    //this.sprite.debug = true; //Shows the collider
    //Set the update function (handles entity logic)
    //So you call "[entity_name].update()" and it handles logic
    this.update = update;

    this.xspd = 0; //The x velocity
    this.yspd = 0; //The y velocity
    //X and Y positions can be accessed through "[entity_name].sprite.position.[x/y]"

    this.hp = hp; //The health of the entity

    this.jumpCount = 0;

    this.attCounter = 0; //The number of frames till the attack ends
    this.attDelay = 0;
  }

  hit(dmg) {
    if (dmg != undefined) {
      this.hp = Math.max(this.hp - dmg, 0);
    }
    return (this.hp > 0); //Returns whether he's alive
  }

  collCheck(obstacles) { //Returns the obstacle collided with
    for (let i = 0; i < obstacles.length; i++) {
      if (this.sprite.overlap(obstacles[i].sprite)) {
        return obstacles[i];
      }
    }
    return false; //Or false if nothing's been collided with
  }

  loadAnims(anims) {
    for (let i = 0; i < anims.length; i++) {
      const anim = loadSpriteSheet(...anims[i]);
      loadAnimation(anim);
      this.sprite.addAnimation("animation" + i, anim);
    }
  }

  draw() {
    drawSprite(this.sprite);
  }
}