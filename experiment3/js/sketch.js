// sketch.js - remix of this project: http://www.generative-gestaltung.de/2/sketches/?02_M/M_1_5_02
// Author: Michael Quinn
// Date: 1/29/2024

// ------ mesh ------
var tileCount;
var zScale;

// ------ noise ------
var noiseXRange;
var noiseYRange;
var octaves;
var falloff;

// ------ mesh coloring ------
var midColor;
var topColor;
var bottomColor;
var strokeColor;
var threshold;

// ------ mouse interaction ------
var offsetX;
var offsetY;
var clickX;
var clickY;
var zoom;
var rotationX;
var rotationZ;
var targetRotationX;
var targetRotationZ;
var clickRotationX;
var clickRotationZ;

var canvasContainer;

function setup() {
  // Place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");

  // Resize canvas when the page is resized
  $(window).resize(function () {
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });

  colorMode(HSB, 360, 100, 100);
  cursor(CROSS);

  // ------ mesh ------
  tileCount = 50;
  zScale = 150;

  // ------ noise ------
  noiseXRange = 10;
  noiseYRange = 10;
  octaves = 4;
  falloff = 0.5;

  // ------ mesh coloring ------
  topColor = color(0, 0, 100);
  midColor = color(191, 99, 63);
  bottomColor = color(0, 0, 0);
  strokeColor = color(180, 100, 100);
  threshold = 0.30;

  // ------ mouse interaction ------
  offsetX = 0;
  offsetY = 0;
  clickX = 0;
  clickY = 0;
  zoom = -300;
  rotationX = 0;
  rotationZ = 0;
  targetRotationX = PI / 3;
  targetRotationZ = 0;
}

var hueOffset = 0; // Added variable for hue offset

function draw() {
  background(0, 0, 100);
  ambientLight(150);

  // ------ set view ------
  push();
  translate(width * 0.05, height * 0.05, zoom);

  if (mouseIsPressed && mouseButton == RIGHT) {
    offsetX = mouseX - clickX;
    offsetY = mouseY - clickY;
    targetRotationX = min(max(clickRotationX + offsetY / float(width) * TWO_PI, -HALF_PI), HALF_PI);
    targetRotationZ = clickRotationZ + offsetX / float(height) * TWO_PI;
  }
  rotationX += (targetRotationX - rotationX) * 0.25;
  rotationZ += (targetRotationZ - rotationZ) * 0.25;

  // Flip the object upside down
  rotateX(PI - rotationX);
  rotateZ(PI - rotationZ);

  // ------ mesh noise ------
  if (mouseIsPressed && mouseButton == LEFT) {
    noiseXRange = mouseX / 10;
    noiseYRange = mouseY / 10;
  }

  noiseDetail(octaves, falloff);
  var noiseYMax = 0;

  var tileSizeY = height / tileCount;
  var noiseStepY = noiseYRange / tileCount;

  for (var meshY = 0; meshY <= tileCount; meshY++) {
    beginShape(TRIANGLE_STRIP);
    for (var meshX = 0; meshX <= tileCount; meshX++) {

      var angle = map(meshX, 0, tileCount, 0, TWO_PI);
      var radius = width * 0.35;

      var x = radius * cos(angle);
      var y = radius * sin(angle);

      var noiseX = map(meshX, 0, tileCount, 0, noiseXRange);
      var noiseY = map(meshY, 0, tileCount, 0, noiseYRange);
      var z1 = noise(noiseX, noiseY);
      var z2 = noise(noiseX, noiseY + noiseStepY);

      noiseYMax = max(noiseYMax, z1);
      var interColor;
      colorMode(HSB, 360, 100, 100);

      var hue = (frameCount);
      
      var amount;
      if (z1 <= threshold) {
        amount = map(z1, 0, threshold, 0.15, 1);
        interColor = lerpColor(bottomColor, midColor, amount);
      } else {
        amount = map(z1, threshold, noiseYMax, 0, 1);
        interColor = lerpColor(midColor, topColor, amount);
      }
      fill((hue + x) % 360, 80, 90); // Dynamic hue with reduced saturation and brightness
      stroke(strokeColor);
      strokeWeight(1);
      vertex(x, y, z1 * zScale);
      vertex(x, y + tileSizeY, z2 * zScale);
    }
    endShape();
  }
  pop();
}

function mousePressed() {
  clickX = mouseX;
  clickY = mouseY;
  clickRotationX = rotationX;
  clickRotationZ = rotationZ;
}

function keyReleased() {
  if (keyCode == UP_ARROW) falloff += 0.05;
  if (keyCode == DOWN_ARROW) falloff -= 0.05;
  if (falloff > 1.0) falloff = 1.0;
  if (falloff < 0.0) falloff = 0.0;

  if (keyCode == LEFT_ARROW) octaves--;
  if (keyCode == RIGHT_ARROW) octaves++;
  if (octaves < 0) octaves = 0;

  if (keyCode == 187) zoom += 20; // '+'
  if (keyCode == 189) zoom -= 20; // '-'

  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == ' ') noiseSeed(floor(random(100000)));
}