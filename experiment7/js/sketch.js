// sketch.js - purpose and description here
// Author: Your Name
// Date:

let angle = 0;
let rotationSpeed = 0.05; // Adjust the speed of manual rotation
let table;
let r = 200;

let earth;

function preload() {
  earth = loadImage('earth.jpg');
  // table = loadTable(
  //   'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.csv',
  //   'header'
  // );
  // table = loadTable(
  //   'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv',
  //   'header'
  // );
  // This dataset is more medium sized, giving a decent number of
  // earthquakes to look at without slowing the sketch down as much.
  table = loadTable(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.csv',
    'header'
  );
}

function setup() {
  canvasContainer = $("#canvas-container");
let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
canvas.parent("canvas-container");
}

function draw() {
  background(51);
  // We don't need to translate here, since WEBGL mode centers the view
  rotateY(angle);

  // Manual rotation control with arrow keys
  if (keyIsDown(LEFT_ARROW)) {
    angle -= rotationSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    angle += rotationSpeed;
  }

  //lights();
  fill(10);
  //noStroke();
  // While the video shows that this doesn't work for texturing the
  // sphere, that's only true for Processing - in p5.js, it does work.
  texture(earth);
  sphere(r);

  // The rows are here a field instead of a method, and the getFloat()
  // method is replaced by getNum() since JS only has one number type.
  for (let row of table.rows) {
    let lat = row.getNum('latitude');
    let lon = row.getNum('longitude');
    let mag = row.getNum('mag');

    // original version
    // let theta = radians(lat) + PI/2;

    // fix: no + PI/2 needed, since latitude is between -180 and 180 deg
    let theta = radians(lat);

    let phi = radians(lon) + PI;

    // original version
    // let x = r * sin(theta) * cos(phi);
    // let y = -r * sin(theta) * sin(phi);
    // let z = r * cos(theta);

    // fix: in OpenGL, y & z axes are flipped from math notation of spherical coordinates
    let x = r * cos(theta) * cos(phi);
    let y = -r * sin(theta);
    let z = -r * cos(theta) * sin(phi);

    let pos = createVector(x, y, z);

    let h = pow(10, mag);
    let maxh = pow(10, 7);
    h = map(h, 0, maxh, 10, 100);
    let xaxis = createVector(1, 0, 0);

    // Processing's PVector.angleBetween has a range from 0 to PI,
    // while p5.js' vector.angleBetween has a range from -PI to PI.
    // This is because it includes information about which direction
    // the angle goes (that is, if the first vector is the X axis,
    // whether the angle to the second vector is upwards or downwards).
    // We don't want the direction here, just the angle itself, so we
    // take the absolute value of the returned value to get that.
    let angleb = abs(xaxis.angleBetween(pos));

    let raxis = xaxis.cross(pos);

    push();
    translate(x, y, z);
    // In p5.js, the rotation axis is a vector object instead of x,y,z
    rotate(angleb, raxis);
    fill(255);
    box(h, 5, 5);
    pop();
  }
}