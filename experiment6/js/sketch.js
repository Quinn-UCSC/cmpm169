/// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let font1;
let colorSpeed = 5;
let textSpeed = 0.1;
let radius = 400;
let tubeRadius = 100;
let textTexture;
let canvas;
let words = ['---MICHAEL HIDES THE BEST SECRETS----DISCO SECRETS!----SECRETS FOR PRESIDENT!----THERE IS NOT TURNING BACK-----SECRET MODE ENGAGED----SECRETS SECRETS SECRETS SECRETS----SECRETS ROOM 2024!!----NEVER GIVE UP ON YOUR DREAMS----SECRET OF THE YEAR EVERY YEAR----YOU NEVER GO SECRET----ONCE YOU GO SECRET -- GO GO SECRET'];
let sound;
let soundOn;

let previousMouseX = 0;
let previousMouseY = 0;

function preload() {
    font1 = loadFont('./font/itc-avant-garde-gothic-std-bold-589572c7e9955.otf');
}

function setup() {
// Place our canvas, making it fit our container
canvasContainer = $("#canvas-container");
let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
canvas.parent("canvas-container");

    textTexture = createGraphics(5 * PI * radius, 2 * PI * 150);
    textTexture.clear();
    textTexture.textSize(70);
    textTexture.textFont(font1);
    noStroke();

    soundOn = false;
}

function soundLoaded() {
    sound.playMode('restart'); // Set the play mode to restart when it reaches the end
    sound.loop(); // Loop the audio file
}

function draw() {
    let rainbowBackground = color('hsb(' + (frameCount * colorSpeed % 360) + ', 100%, 80%)');
    background(rainbowBackground);

    scale(20);
    orbitControl();
    textTexture.clear();

    let rainbowColors = [];

    // Generate rainbow colors based on frame count
    for (let i = 0; i < 360; i++) {
        let hue = (frameCount * colorSpeed + i) % 360; // Vary hue over time
        rainbowColors[i] = color('hsb(' + hue + ', 100%, 100%)');
    }

    textTexture.clear();
    for (let i = 0; i <= 15; i++) {
        let rainbowIndex = (frameCount + i * 10) % 360; // Use different colors for each line
        textTexture.fill(rainbowColors[rainbowIndex]);
        textTexture.text(words[0], 0, i * 70);
    }

    rotateY(-frameCount*textSpeed);
    texture(textTexture);
    cylinder(radius, 1500, 60, 1, false, false);
    plane(500,500);
}

function mousePressed() {
    if (soundOn == false) {
        sound = loadSound('./audio/The Stanley Parable - Complete Secret Disco Music.mp3', soundLoaded); // Load the audio file
        soundOn = true;
    }
    else {

    }
}