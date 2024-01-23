// sketch.js - purpose and description here
// Author: Your Name
// Date:

/**
 * shapes in a grid, that are always facing the mouse
 *
 * MOUSE
 * position x/y        : position to face
 *
 * KEYS
 * 1-7                 : choose shapes
 * arrow up/down       : scale of shapes
 * arrow left/right    : additional rotation of shapes
 * d                   : toggle size depending on distance
 * g                   : toggle grid resolution
 * s                   : save png
 */
'use strict';

var tileCount = 10;
var tileWidth;
var tileHeight;
var shapeSize = 50;
var newShapeSize = shapeSize;
var shapeAngle = 0;
var maxDist;
var currentShape;
var shapes;
var sizeMode = 0;

// Particle system variables
let particles = [];

let canvasContainer;
let bgColor1, bgColor2; // Background color variables
let colorChangeSpeed = 0.005; // Adjust this value to control the speed of color change

function preload() {
  shapes = [];
  shapes.push(loadImage('../experiment2/data/module_1.svg'));
  shapes.push(loadImage('../experiment2/data/module_2.svg'));
  shapes.push(loadImage('../experiment2/data/module_3.svg'));
  shapes.push(loadImage('../experiment2/data/module_4.svg'));
  shapes.push(loadImage('../experiment2/data/module_5.svg'));
  shapes.push(loadImage('../experiment2/data/module_6.svg'));
  shapes.push(loadImage('../experiment2/data/module_7.svg'));
}

function setup() {
  // Place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // Resize canvas when the page is resized
  $(window).resize(function () {
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });

  // Additional setup for the first script
  imageMode(CENTER);
  currentShape = shapes[0];
  tileWidth = width / tileCount;
  tileHeight = height / tileCount;
  maxDist = sqrt(pow(width, 2) + pow(height, 2));

  // Initialize particles
  for (let i = 0; i < 100; i++) {
    particles.push(createVector(random(width), random(height)));
  }

  // Set initial background colors
  bgColor1 = color(random(255), random(255), random(255));
  bgColor2 = color(random(255), random(255), random(255));
}

function draw() {
    // Update background colors over time with a delay
    let lerpedColor = lerpColor(bgColor1, bgColor2, sin(frameCount * colorChangeSpeed));
    background(lerpedColor);
  
    // Update and display particles
    for (let particle of particles) {
      // Add gravity to make particles fall
      let gravity = createVector(0, 2);
      particle.add(gravity);
  
      ellipse(particle.x, particle.y, 10, 10);

      // Check for mouse-click interaction
    if (mouseIsPressed && dist(mouseX, mouseY, particle.x, particle.y) < 10) {
        // Launch the particle into the air by giving it an initial upward velocity
        particle.y -= 10; // Adjust this value for desired launch height
        particle.yVelocity = -5; // Adjust this value for desired initial upward velocity
      }
  
      // Apply upward velocity if it exists
      if (particle.yVelocity) {
        particle.y += particle.yVelocity;
        particle.yVelocity += gravity.y;
      }
  
      // Reset particle position when it goes below the canvas
      if (particle.y > height) {
        particle.set(random(width), random(-height, 0));
      }
    }
  
    for (var gridY = 0; gridY < tileCount; gridY++) {
      for (var gridX = 0; gridX < tileCount; gridX++) {
        var posX = tileWidth * gridX + tileWidth / 2;
        var posY = tileHeight * gridY + tileWidth / 2;
  
        var angle = atan2(mouseY - posY, mouseX - posX) + (shapeAngle * (PI / 180));
  
        if (sizeMode == 0) newShapeSize = shapeSize;
        if (sizeMode == 1) newShapeSize = shapeSize * 1.5 - map(dist(mouseX, mouseY, posX, posY), 0, 500, 5, shapeSize);
        if (sizeMode == 2) newShapeSize = map(dist(mouseX, mouseY, posX, posY), 0, 500, 5, shapeSize);
  
        push();
        translate(posX, posY);
        rotate(angle);
        noStroke();
        fill(random(360), 100, 100); // Set fill color based on random hue
        image(currentShape, 0, 0, newShapeSize, newShapeSize);
        pop();
      }
    }
  }

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == 'd' || key == 'D') sizeMode = (sizeMode + 1) % 3;
  if (key == 'g' || key == 'G') {
    tileCount += 5;
    if (tileCount > 20) {
      tileCount = 10;
    }
    tileWidth = width / tileCount;
    tileHeight = height / tileCount;
  }

  if (key == '1') currentShape = shapes[0];
  if (key == '2') currentShape = shapes[1];
  if (key == '3') currentShape = shapes[2];
  if (key == '4') currentShape = shapes[3];
  if (key == '5') currentShape = shapes[4];
  if (key == '6') currentShape = shapes[5];
  if (key == '7') currentShape = shapes[6];

  if (keyCode == UP_ARROW) shapeSize += 5;
  if (keyCode == DOWN_ARROW) shapeSize = max(shapeSize - 5, 5);
  if (keyCode == LEFT_ARROW) shapeAngle += 5;
  if (keyCode == RIGHT_ARROW) shapeAngle -= 5;
}