// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let f = 0;
let w = 100;
let d = 50;
let W = 400;

let canvasContainer;
let rotationSpeed = 0.01; // Initial rotation speed

function setup() {
  // Place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");

  // Resize canvas when the page is resized
  $(window).resize(function () {
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });

  w = canvasContainer.height() / 4;
  d = w / 2;
  colorMode(HSB, 1); // Set color mode to HSB
}

draw = _ => {
	background(50);
	noStroke();
	[2, 2, -2].map(i => spotLight(W, W, W, 0, -W * i, w, 0, i, 0));
	rotateY(f += rotationSpeed); // Rotate based on rotationSpeed
	for (z = -w; z <= w; z += d) {
		for (y = -w; y <= w; y += d) {
			for (x = -w; x <= w; x += d) {
				push();
				translate(x, y, z);
				let hue = (frameCount / 100) % 1; // Generate smoothly changing hue
				let col = color(hue, 1, 1); // Create color using HSB
				fill(col);
				sphere((sin(x / w + y / w + z + f * 2) / 16) * (windowHeight));
				pop();
			}
		}
	}
}

function mouseMoved() {
    // Change rotation speed based on mouse movement along the X-axis
    rotationSpeed = map(mouseX, 0, width, -0.1, 0.1);
  }