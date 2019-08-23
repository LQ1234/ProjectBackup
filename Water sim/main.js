var supposedScreenSize = {
  'x': 100,
  'y': 100
};
var crispness = 1;
var images = {
  "hi": "https://dummyimage.com/400x400/000/fff"
};

/*var ps = new Particlesys(function(particle, world) {

  var newxv=particle.xv,newyv=particle.yv;

  world.getWithinRange(particle, 40).forEach((i) => {
    var dist = Math.hypot(particle.x - i.x, particle.y - i.y);
    if (dist > 4) {
      newxv+= (i.x - particle.x) * i.size / Math.pow(dist, 2.2) / 1;
      newxv+= (i.y - particle.y) * i.size / Math.pow(dist, 2.2) / 1;
    }
    if (dist > 0) {
      newxv +=  (particle.x - i.x) * i.size / dist * Math.max(0, 5 - dist) / 2;
      newxv +=  (particle.y - i.y) * i.size / dist * Math.max(0, 5 - dist) / 2;
    }
  });
  //newyv=Math.max(newyv,-1);
  //newyv=Math.min(newyv,1);
  //newxv=Math.max(newxv,-1);
  //newxv=Math.min(newxv,1);

  particle.yv=newyv;
  particle.xv=newxv;

  particle.yv += 2;

  if (particle.y > 0) {
    particle.y -= particle.yv;

    particle.yv *= -.5;
  }

  particle.xv *= .9;
  particle.yv *= .9;

}, new generators.randomDir(600, 400, 1000, 6), 10);*/

var ps = new Particlesys(function(particle, world) {

  var newxv=0,newyv=0;

  world.getWithinRange(particle, 40).forEach((i) => {
    var dist = Math.hypot(particle.x - i.x, particle.y - i.y);
    if (dist > 6) {
      newxv+= (i.x - particle.x) * i.size / Math.pow(dist, 2.1) / 2;
      newyv+= (i.y - particle.y) * i.size / Math.pow(dist, 2.1) / 2;
    }
    if (dist > 0) {
      newxv +=  (particle.x - i.x) * i.size / dist * Math.pow(Math.max(0, 5 - dist),1.3) / 2;
      newyv +=  (particle.y - i.y) * i.size / dist *Math.pow( Math.max(0, 5 - dist),1.3) / 2;
    }
  });
  newyv=Math.max(newyv,-1);
  newyv=Math.min(newyv,1);
  newxv=Math.max(newxv,-1);
  newxv=Math.min(newxv,1);

  particle.yv+=newyv;
  particle.xv+=newxv;

  particle.yv += 2;

  if (particle.y > 0) {
    particle.y -= particle.yv;

    particle.yv *= -.1;
  }

  particle.xv *= .9;
  particle.yv *= .9;

}, new generators.randomDir(800, 700, 1300, 10), 10);
ps.forEach(function(i) {
  i.y -= 4000
});


var mousescrool = 0;

function drawBG(ctx) {

  ps.userControl(ctx, mouse.fg.x, mouse.fg.y, mouse.down, mousescrool);
  mousescrool = 0;
  //ps.draw(ctx,mouse.x,mouse.y,sz,10);
}

function tick() {
  ps.tick();

}

function drawFG(ctx) {
  /*
    ctx.fillStyle = "#400000";
    ctx.fillRect(-10, -10, 20, 20);
    ctx.drawImage(images["hi"],0,0,10,10);*/
}
window.onwheel = function(event) {
  mousescrool = (event.deltaY);
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
  'fg': {
    x: 0,
    y: 0
  },
  'down': false
}
var keyboard = {
  code: {

  }
}

window.setInterval(draw, 50);
window.onresize = draw;
window.setInterval(tick, 50);

function handleMouseEvent(x, y) {
  var canvas = document.getElementById('bg');

  var scale = supposedScreenSize.x / supposedScreenSize.y > canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  mouse.x = (x - window.innerWidth / 2) / scale * crispness;
  mouse.y = (y - window.innerHeight / 2) / scale * crispness;
  scale = supposedScreenSize.x / supposedScreenSize.y < canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  mouse.fg.x = (x - window.innerWidth / 2) / scale * crispness;
  mouse.fg.y = (y - window.innerHeight / 2) / scale * crispness;
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
