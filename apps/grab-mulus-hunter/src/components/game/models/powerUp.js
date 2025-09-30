export default class PowerUp {
  constructor({ position }, tileLength) {
    this.position = position;
    this.radius = (tileLength * 7) / 20;
    this.hasBeenEaten = false;
    this.rate = -tileLength / 50;
    this.tileLength = tileLength;

    // Load coin image
    this.image = new Image();
    this.image.src = "./images/coin.png";
  }

  changeEatenState() {
    this.hasBeenEaten = this.hasBeenEaten ? false : true;
  }

  update(ctx) {
    this.draw(ctx);
    this.flash();
  }

  draw(ctx) {
    ctx.save();

    // Add subtle opacity pulsing effect
    const baseOpacity = 0.8;
    const opacityVariation = 0.2;
    const radiusPercentage = (this.radius - this.tileLength / 4) /
                           ((this.tileLength * 9) / 20 - this.tileLength / 4);
    const opacity = baseOpacity + (opacityVariation * radiusPercentage);
    ctx.globalAlpha = Math.max(0.6, Math.min(1, opacity));

    // Base size with pulsing effect
    const baseSize = this.tileLength * 2;
    const pulseOffset = (this.radius - (this.tileLength * 7) / 20) * 1.5; // Gentle pulse
    const size = baseSize + pulseOffset;

    ctx.drawImage(
      this.image,
      this.position.x - size / 2,
      this.position.y - size / 2,
      size,
      size
    );

    ctx.restore();
  }

  flash() {
    if (
      this.radius <= this.tileLength / 4 ||
      this.radius >= (this.tileLength * 9) / 20
    ) {
      this.rate = -this.rate;
    }
    this.radius += this.rate;
  }
}
