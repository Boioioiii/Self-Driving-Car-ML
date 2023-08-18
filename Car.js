class Car {
  //Set up the car object's attributes
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    //Add in spd and acceleration Attributes
    this.speed = 0;
    this.acceleration = 0.2;

    //Add in friction Attribute for forwards/backwards
    this.maxSpeed = 3;
    this.friction = 0.05;

    //Add in friction for going diagonal
    this.angle = 0;

    this.controls = new Controls();
  }

  //Updates the car's position based on the key pressed
  update() {
    this.#move();
  }

  //Functionality move
  #move() {
    if (this.controls.forward) {
      //speed will increase based on acceleration
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      //speed will decrease based on acceleration
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    //-speed indicates the car is going backwards
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    //if the speed is increasing, the car will slow due to friction going forward
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    //if the speed is decreasing, the car will slow due to friction going backwards
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    //this will resolve the issue when right+down r pressed, it doesn't got he wrong way
    if (this.speed != 0) {
      //if the speed is not zero, then the value of this flip is 1 or -1 depending on the speed.
      //if spd > 0, flip will be 1, if spd < 0, flip will be -1
      const flip = this.speed > 0 ? 1 : -1;

      //Left and Right implementation
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
    //Scale movement based on the unit circle
    //this allows us to move diagonally properly
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  //The car objects methods/functions
  //The X of the car is the center of the car
  //the Y of the car is the center of the car
  draw(ctx) {
    //Doing the rotation
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    //Since we are translating to x and y, we don't need to do x - width/2 and y - height/2, instead
    //we can just do -width/2 and -height/2
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    //Needs to restore because otherwise on each frame of the animation, we will be translating, and rotating over and over again
    //to the point, the car itself will be roating
    ctx.restore();
  }
}
