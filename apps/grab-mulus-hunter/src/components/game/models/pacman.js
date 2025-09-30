import { Howl } from "howler";

export default class PacMan {
  constructor(
    { position, velocity },
    tileLength,
    munchOne = new Howl({
      src: "./audio/munch_one.wav",
      volume: 0.1,
    }),
    munchTwo = new Howl({
      src: "./audio/munch_two.wav",
      volume: 0.1,
    })
  ) {
    this.originalPosition = position;
    this.position = { ...this.originalPosition };
    this.originalVelocity = velocity;
    this.velocity = { ...this.originalVelocity };
    this.tileLength = tileLength;
    this.radius = (tileLength * 3) / 8;
    this.speed = tileLength / 8;
    this.radians = Math.PI / 4;
    this.openRate = Math.PI / 36;
    this.shrinkRate = Math.PI / 220;
    this.rotation = 0;
    this.lives = 0;
    this.isEating = false;
    this.isShrinking = false;
    this.isLevellingUp = false;
    this.munchOne = munchOne;
    this.munchTwo = munchTwo;

    // Image assets for sprite-based rendering
    this.image = new Image();
    this.up = new Image();
    this.up.src = "./images/main-up.png";
    this.down = new Image();
    this.down.src = "./images/main-down.png";
    this.left = new Image();
    this.left.src = "./images/main-left.png";
    this.right = new Image();
    this.right.src = "./images/main-right.png";

    // Set initial sprite
    this.assignSprite();
  }

  draw(ctx) {
    const size = this.radius * 8; // Make Pacman much bigger
    ctx.drawImage(
      this.image,
      this.position.x - size / 2,
      this.position.y - size / 2,
      size,
      size
    );
  }

  update(ctx) {
    this.assignSprite();
    this.draw(ctx);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.chomp();
    } else {
      this.radians = Math.PI / 4;
    }
  }

  chomp() {
    // Simplified for image-based approach - only handle audio
    if (this.radians < Math.PI / 36 || this.radians > Math.PI / 4) {
      if (this.isEating)
        this.openRate < 0 ? this.munchOne.play() : this.munchTwo.play();
      this.openRate = -this.openRate;
    }
    this.radians += this.openRate;
  }

  checkRotation() {
    // Rotation no longer needed since we use directional sprites
    // Keep for backward compatibility if needed elsewhere
  }

  shrink(ctx) {
    this.draw(ctx);
    this.radians += this.shrinkRate;
  }

  assignSprite() {
    if (this.velocity.y < 0) this.image = this.up;
    else if (this.velocity.x < 0) this.image = this.left;
    else if (this.velocity.x > 0) this.image = this.right;
    else if (this.velocity.y > 0) this.image = this.down;
    else this.image = this.right; // default facing right when stationary
  }

  reset() {
    this.position = { ...this.originalPosition };
    this.velocity = { ...this.originalVelocity };
    this.radians = Math.PI / 4;
    this.openRate = Math.PI / 36;
    this.rotation = 0;
    this.assignSprite();
  }
}
