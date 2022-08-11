export const ARM_HEIGHT = 1000;
export const ARM_WIDTH = 125;

export class FaceStamp {
  zIndex = 0;

  constructor({ image, centerX, centerY, rotation }) {
    this.image = image;
    this.centerX = centerX;
    this.centerY = centerY;

    // As degree
    this.rotation = rotation || 0;
  }

  draw(context) {
    context.save();

    context.translate(this.centerX + 50, this.centerY + 50);
    context.rotate((Math.PI / 180) * this.rotation);
    context.translate(-this.centerX - 50, -this.centerY - 50);

    context.drawImage(this.image, this.centerX, this.centerY, 100, 100);

    context.restore();
  }
}

export class Arm {
  zIndex = 1;

  constructor({ image, startX, startY, targetX, targetY, rotation, stamp }) {
    this.image = image;
    this.startX = Math.floor(startX);
    this.startY = Math.floor(startY);

    this.targetX = Math.floor(targetX);
    this.targetY = Math.floor(targetY);

    this.rotation = rotation;

    this.step = 0;
    this.scale = 50;
    this.backStep = 0;

    this.stamp = stamp;
    this.stamped = false;
  }

  isStamp() {
    if (this.step >= 100 && this.scale <= 0 && !this.stamped) {
      return true;
    }
    return false;
  }

  applyStamp() {
    this.stamped = true;
    return this.stamp;
  }

  isEndAnimation() {
    if (this.step >= 100 && this.scale <= -50 && this.backStep >= 100) {
      return true;
    }
    return false;
  }

  nextFrame() {
    if (this.step < 100) {
      this.step = Math.min(this.step + 1, 100);
    } else if (this.scale > -50) {
      this.scale = Math.max(this.scale - 5, -50);
    } else if (this.backStep < 100) {
      this.backStep = Math.min(this.backStep + 1, 100);
    }
  }

  draw(context) {
    context.save();

    const xUnit = (this.targetX - this.startX) / 100;
    const yUnit = (this.targetY - this.startY) / 100;
    const currentX = this.startX + xUnit * (this.step - this.backStep);
    const currentY = this.startY + yUnit * (this.step - this.backStep);

    const currentScale = Math.abs(this.scale) * 0.002 + 0.9;

    // const stampX = currentX + ARM_WIDTH / 2;
    // const stampY = currentY + ARM_HEIGHT - ARM_WIDTH / 2;

    context.translate(currentX + ARM_WIDTH / 2, currentY + ARM_WIDTH / 2);
    context.rotate((Math.PI / 180) * this.rotation);
    context.scale(currentScale, currentScale);
    context.translate(-currentX - ARM_WIDTH / 2, -currentY + -ARM_WIDTH / 2);

    context.drawImage(this.image, currentX, currentY, ARM_WIDTH, ARM_HEIGHT);

    // context.fillStyle = 'blue';
    // context.fillRect(currentX + ARM_WIDTH / 2, currentY + 50, 10, 10);

    // context.translate(+stampX, stampY);
    // context.rotate((Math.PI / 180) * this.rotation);
    // context.translate(-stampX, -stampY);

    // context.fillStyle = 'red';
    // context.fillRect(stampX, stampY, 5, 5);

    context.restore();
  }
}
