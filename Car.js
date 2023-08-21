class Car {
  //Set up the car object's attributes
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    //Add in spd and acceleration Attributes
    this.speed = 0;
    this.acceleration = 0.2;

    //Add in friction Attribute for forwards/backwards
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;

    //Add in friction for going diagonal
    this.angle = 0;

    //Add damage
    this.damage = false;

    //Add in brain:
    this.useBrain = controlType == "AI";

    if (controlType != "DUMMY") {
      //Add in sensors, we are passing in the car
      this.sensor = new Sensor(this);
      this.brain = new NeuroNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.controls = new Controls(controlType);
  }

  //Updates the car's position based on the key pressed
  update(roadBorders, traffic) {
    if (!this.damage) {
      this.#move();
      //Add the polygon
      this.polygon = this.#createPolygon();
      //Determine Damage
      this.damage = this.#assessDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      //tell the sensor to update
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((e) =>
        e == null ? 0 : 1 - e.offset
      );

      const outputs = NeuroNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polyIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polyIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  //Can use this to draw car instead
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    //gives us the angle w width and hegiht
    const alpha = Math.atan2(this.height, this.width);
    points.push({
      x: this.x - Math.cos(this.angle - alpha) * rad,
      y: this.y - Math.sin(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.cos(this.angle + alpha) * rad,
      y: this.y - Math.sin(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.cos(this.angle + Math.PI - alpha) * rad,
      y: this.y - Math.sin(this.angle + Math.PI - alpha) * rad,
    });
    points.push({
      x: this.x - Math.cos(this.angle + Math.PI + alpha) * rad,
      y: this.y - Math.sin(this.angle + Math.PI + alpha) * rad,
    });

    return points;
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
  draw(ctx, color, drawSensor = false) {
    //After implementing ploygon, this is no longer needed-------------
    //Doing the rotation
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // //Since we are translating to x and y, we don't need to do x - width/2 and y - height/2, instead
    // //we can just do -width/2 and -height/2
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fill();

    // //Needs to restore because otherwise on each frame of the animation, we will be translating, and rotating over and over again
    // //to the point, the car itself will be roating
    // ctx.restore();
    //After implementing polygon, the above is no longer neeed------------------

    //Check for damage:
    if (this.damage) {
      ctx.fillStyle = "grey";
    } else {
      ctx.fillStyle = color;
    }

    //IMplement polygon instead:
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (this.sensor && drawSensor) {
      //tell teh sensor to draw itself
      this.sensor.draw(ctx);
    }
  }
}
//----------------------------------------------------------
// class Car {
//   constructor(x, y, width, height, controlType, maxSpeed = 3) {
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;

//     this.speed = 0;
//     this.acceleration = 0.2;
//     this.maxSpeed = maxSpeed;
//     this.friction = 0.05;
//     this.angle = 0;
//     this.damaged = false;

//     this.useBrain = controlType == "AI";

//     if (controlType != "DUMMY") {
//       this.sensor = new Sensor(this);
//       this.brain = new NeuroNetwork([this.sensor.rayCount, 6, 4]);
//     }
//     this.controls = new Controls(controlType);
//   }

//   update(roadBorders, traffic) {
//     if (!this.damaged) {
//       this.#move();
//       this.polygon = this.#createPolygon();
//       this.damaged = this.#assessDamage(roadBorders, traffic);
//     }
//     if (this.sensor) {
//       this.sensor.update(roadBorders, traffic);
//       const offsets = this.sensor.readings.map((s) =>
//         s == null ? 0 : 1 - s.offset
//       );
//       const outputs = NeuroNetwork.feedForward(offsets, this.brain);

//       if (this.useBrain) {
//         this.controls.forward = outputs[0];
//         this.controls.left = outputs[1];
//         this.controls.right = outputs[2];
//         this.controls.reverse = outputs[3];
//       }
//     }
//   }

//   #assessDamage(roadBorders, traffic) {
//     for (let i = 0; i < roadBorders.length; i++) {
//       if (polyIntersect(this.polygon, roadBorders[i])) {
//         return true;
//       }
//     }
//     for (let i = 0; i < traffic.length; i++) {
//       if (polyIntersect(this.polygon, traffic[i].polygon)) {
//         return true;
//       }
//     }
//     return false;
//   }

//   #createPolygon() {
//     const points = [];
//     const rad = Math.hypot(this.width, this.height) / 2;
//     const alpha = Math.atan2(this.width, this.height);
//     points.push({
//       x: this.x - Math.sin(this.angle - alpha) * rad,
//       y: this.y - Math.cos(this.angle - alpha) * rad,
//     });
//     points.push({
//       x: this.x - Math.sin(this.angle + alpha) * rad,
//       y: this.y - Math.cos(this.angle + alpha) * rad,
//     });
//     points.push({
//       x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
//       y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
//     });
//     points.push({
//       x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
//       y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
//     });
//     return points;
//   }

//   #move() {
//     if (this.controls.forward) {
//       this.speed += this.acceleration;
//     }
//     if (this.controls.reverse) {
//       this.speed -= this.acceleration;
//     }

//     if (this.speed > this.maxSpeed) {
//       this.speed = this.maxSpeed;
//     }
//     if (this.speed < -this.maxSpeed / 2) {
//       this.speed = -this.maxSpeed / 2;
//     }

//     if (this.speed > 0) {
//       this.speed -= this.friction;
//     }
//     if (this.speed < 0) {
//       this.speed += this.friction;
//     }
//     if (Math.abs(this.speed) < this.friction) {
//       this.speed = 0;
//     }

//     if (this.speed != 0) {
//       const flip = this.speed > 0 ? 1 : -1;
//       if (this.controls.left) {
//         this.angle += 0.03 * flip;
//       }
//       if (this.controls.right) {
//         this.angle -= 0.03 * flip;
//       }
//     }

//     this.x -= Math.sin(this.angle) * this.speed;
//     this.y -= Math.cos(this.angle) * this.speed;
//   }

//   draw(ctx, color, drawSensor = false) {
//     if (this.damaged) {
//       ctx.fillStyle = "gray";
//     } else {
//       ctx.fillStyle = color;
//     }
//     ctx.beginPath();
//     ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
//     for (let i = 1; i < this.polygon.length; i++) {
//       ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
//     }
//     ctx.fill();

//     if (this.sensor && drawSensor) {
//       this.sensor.draw(ctx);
//     }
//   }
// }
