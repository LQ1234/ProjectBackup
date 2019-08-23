var supposedScreenSize = {
  'x': 150,
  'y': 100
};
var crispness = 3;
var images = {
  "hi": "https://dummyimage.com/600x400/000/fff"
};
var xx = 0,
  yy = 0;
var sela = 0,
  selb = 0;

function drawBG(ctx) {
  //ctx.fillStyle = "#000000";



  //ctx.fillRect(-10, -10, 20, 20);
}

function drawFG(ctx) {


  yy += keyboard.code[40] ? 3 : 0 + keyboard.code[38] ? -3 : 0
  xx += keyboard.code[39] ? 3 : 0 + keyboard.code[37] ? -3 : 0
  var types = [LIG.line, LIG.linesegment, LIG.ray, LIG.arc]
  var typenames = ["line", "linesegment", "ray","arc"]

  var canvas = document.getElementById('bg');


  ctx.font = "2px Verdana";

  //ctx.fillText(a.isect(b), -40, 50);



  var pts = [new LIG.Point(40, -10),
    new LIG.Point(-30, 50),
    new LIG.Point(mouse.x,mouse.y ),
    new LIG.Point(xx-40,yy+ 40),
  ];



  var a = new types[sela](pts[0], pts[1]);
  a.draw(ctx, canvas);

  var b = new types[selb](pts[2], pts[3]);
  b.draw(ctx, canvas);


  var n = b.intersection(a);
  if (n) {
    ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3)
  }

  for (var a = 0; a < types.length; a++) {
    for (var b = 0; b < types.length; b++) {

      ctx.beginPath();
      ctx.lineWidth = .1;
      ctx.strokeStyle = "gray";
      ctx.fillStyle = "white";

      var thic = 9,
        wid = supposedScreenSize.x / thic,
        lay = Math.floor(((a + b * types.length) * wid) / supposedScreenSize.x),
        lb = (((a + b * types.length) % thic) * wid) - (supposedScreenSize.x / 2),
        hei = (supposedScreenSize.y / -2) + lay * wid,
        zoom = .3;

      ctx.rect(lb, hei, wid, wid);
      if (mouse.down && lb <= mouse.x && mouse.x <= lb + wid && hei <= mouse.y && mouse.y <= hei + wid) {
        sela = a;
        selb = b;
      }
      ctx.fill();

      ctx.stroke();

      ctx.save();
      ctx.clip();
      ctx.translate(lb + wid / 2, hei + wid / 2);
      ctx.scale(wid / 100 / zoom, wid / 100 / zoom);

      for (var i = 0; i < pts.length; i++) {
        pts[i].x *= zoom;
        pts[i].y *= zoom;

      }
      var lines = [new types[a](pts[0], pts[1]), new types[b](pts[2], pts[3])];

      lines[0].draw(ctx);
      lines[1].draw(ctx);
      try {

        var sect = lines[0].intersection(lines[1]);
        if (sect) {
          ctx.fillStyle = "red";

          ctx.fillRect(sect.x - .5, sect.y - .5, 1, 1)
        }
      } catch (e) {

        ctx.fillStyle = "rgba(250,0,0,.2)";
        ctx.fillRect(-50, -50, 100, 100);

      }
      if (sela == a && selb == b) {
        ctx.fillStyle = "rgba(0,150,250,.2)";
        ctx.fillRect(-50, -50, 100, 100);
      }

      for (var i = 0; i < pts.length; i++) {
        pts[i].x /= zoom;
        pts[i].y /= zoom;
      }
      ctx.restore();


      ctx.fillStyle = "black";
      ctx.font = "1.5px Verdana";

      var txt = (typenames[a] + ", " + typenames[b]);

      if (ctx.measureText(txt).width > wid) {
        ctx.fillText(typenames[a] + ",", lb + .1, hei + wid - .1 - 1.5);
        ctx.fillText(typenames[b], lb + .1, hei + wid - .1);

      } else {
        ctx.fillText(txt, lb + .1, hei + wid - .1);
      }
    }
  }


}

/*               EXER               */
function touchingline(t, a, b, thic) {
  function rectTouching(p, l, m) {
    return (Math.min(l.x, m.x) <= p.x && p.x <= Math.max(l.x, m.x) && Math.min(l.y, m.y) <= p.y && p.y <= Math.max(l.y, m.y))
  }
  var dx = t.x - a.x;
  var dy = t.y - a.y;
  var distPivot = Math.hypot(dx, dy);
  var ang = Math.atan2(dy, dx);
  ang += Math.atan2(b.y - a.y, b.x - a.x);
  var resultp = new Point(a.x + Math.sin(ang) * distPivot, a.y + Math.cos(ang) * distPivot);
  return rectTouching(resultp, new Point(a.x, a.y - .5 * thic), new Point(a.x + Math.hypot(b.x - a.x, b.y - a.y), a.y + .5 * thic));
}

function drawFatLine(a, b, thic, ctx, fun) {
  ctx.save();
  ctx.translate(a.x, a.y);
  var x = b.x - a.x;
  var y = b.y - a.y;
  ctx.rotate(Math.atan2(y, x));
  fun(0, -.5 * thic, Math.hypot(x, y), thic);
  ctx.restore();
}

function loadImages() {
  var addTo = document.getElementById("_LOADIMG");
  Object.keys(images).forEach(function(i) {
    var g = document.createElement("img");
    g.src = images[i];
    addTo.appendChild(g);
    images[i] = g;
  });
}
document.onload = function() {
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

function Point(x, y) {
  this.x = x;
  this.y = y;
}
