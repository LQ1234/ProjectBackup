var supposedScreenSize = {
  'x': 100,
  'y': 100
};
var crispness = 3;
var images = {
  "hi": "https://dummyimage.com/400x400/000/fff"
};


function drawBG(ctx) {
  ctx.fillStyle = "#000000";

  ctx.fillRect(-10, -10, 20, 20);
}

function drawFG(ctx) {
  ctx.fillStyle = "#400000";
  ctx.fillRect(-10, -10, 20, 20);
  ctx.drawImage(images["hi"],0,0,10,10);
}

/*               EXER               */

function loadImages() {
  var addTo = document.getElementById("_LOADIMG");
  Object.keys(images).forEach(function(i) {
    var g = document.createElement("img");
    g.src = images[i];
    addTo.appendChild(g);
    images[i] = g;
  });
}
window.onload = function() {
  loadImages();
}

function draw() {
  var canvas = document.getElementById('bg');
  canvas.style.transform = "translate(-50%, -50%) scale(" + (1 / crispness) + ")";
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth * crispness;
  canvas.height = window.innerHeight * crispness;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  var scale = supposedScreenSize.x / supposedScreenSize.y < canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  ctx.scale(scale, scale);
  drawBG(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  scale = supposedScreenSize.x / supposedScreenSize.y > canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  ctx.scale(scale, scale);
  drawFG(ctx);

}

var mouse = {
  'x': 0,
  'y': 0,
  'down': false
}
var keyboard = {
  code: {

  }
}
window.setInterval(draw, 50);
window.onresize = draw;

function handleMouseEvent(x, y) {
  var canvas = document.getElementById('bg');

  scale = supposedScreenSize.x / supposedScreenSize.y > canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  mouse.x = (x - window.innerWidth / 2) / scale * crispness;
  mouse.y = (y - window.innerHeight / 2) / scale * crispness;

}
window.onmousedown = function(e) {
  mouse.down = true;
  handleMouseEvent(e.clientX, e.clientY);
}
window.onmouseup = function(e) {
  mouse.down = false;
}
window.onmousemove = function(e) {
  handleMouseEvent(e.clientX, e.clientY);
}
window.onkeydown = function(e) {
  keyboard[e.key] = true;
  keyboard.code[e.keyCode] = true;
}
window.onkeyup = function(e) {
  keyboard[e.key] = false;
  keyboard.code[e.keyCode] = false;
}
