//Set up the road on the screen
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

//Set up the car
const ctx = canvas.getContext("2d");
//x,y,width,height
const car = new Car(100, 100, 30, 50);

//draw the car
car.draw(ctx);

//Update teh car animation based on keypress
animate();

function animate() {
  car.update();

  //this makes the canvas the size of the screen
  //this is so that the car can move around the entire screen
  //without this, the car would be stuck in a small box
  //this is because the canvas is only as big as the html element
  //the canvas element is the light grey box
  //This gives the illusion that the car is moving around the screen, since it actually a small grey screen, that refreshes
  //when the car position changes. This will erase the old car position and allow the new car position to be drawn on a
  //empty gray road
  canvas.height = window.innerHeight;

  car.draw(ctx);

  //request animation frame calls the animate method again and again many fps which gives the illusion of movement.
  requestAnimationFrame(animate);
}
