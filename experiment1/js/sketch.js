// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let angle = 0;
let tailAngle = 0;
let legAngle = 0;

function setup() {
    // place our canvas, making it fit our container
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
    canvas.parent("canvas-container");
    // resize canvas when the page is resized
    $(window).resize(function() {
        console.log("Resizing...");
        resizeCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
    });	
}

function draw() {
    background(200);

    // Body
    box(100, 70, 50);

    // Head
    push();
    translate(0, -50, 0);
    rotateY(angle * 2);
    sphere(40);
    pop();

    // Legs
    drawLeg(-30, 30, legAngle);
    drawLeg(30, 30, -legAngle);

    // Tail
    push();
    translate(-70, 10, 0);
    rotateZ(HALF_PI / 2 + tailAngle);
    cylinder(10, 100);
    pop();

    // Animation
    angle += 0.02;
    tailAngle = sin(angle) * PI / 4; // Simulates wagging
    legAngle = sin(angle * 2) * PI / 8; // Simulates walking animation
}

function drawLeg(x, y, rotation) {
    push();
    translate(x, y, 0);
    rotateZ(rotation);
    box(20, 20, 60);
    pop();
}