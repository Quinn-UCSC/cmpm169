// sketch.js - purpose and description here
// Author: Your Name
// Date:

var video;
var vScale = 16;
var hueValue = 0; // Initialize hue value

function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas when the page is resized
  $(window).resize(function() {
      console.log("Resizing...");
      resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });	

  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width / vScale, height / vScale);
  colorMode(HSB, 360, 150, 100); // Set color mode to HSB
}

function draw() {
  background(50);
  video.loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (video.width - x + 1 + (y * video.width)) * 4;
      var r = video.pixels[index + 1];
      var g = video.pixels[index + 2];
      var b = video.pixels[index + 3];
      var bright = (r + g + b) / 3;
      var w = map(bright, 0, 255, 0, vScale);
      noStroke();
      fill((hueValue + bright) % 360, 100, 100); // Set fill color to HSB with calculated hue
      rectMode(CENTER);
      rect(x * vScale, y * vScale, w, w);
    }
  }
}

// Function to handle key presses
function keyPressed() {
  if (key === '1') {
    hueValue = 0; // Blues to Greens
  } else if (key === '2') {
    hueValue = 120; // Reds to Purples
  } else if (key === '3') {
    hueValue = 240; // Greens to Purples
  }
}