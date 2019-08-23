var supposedScreenSize = {
  'x': 152,
  'y': 152
};
var crispness = 3;
var images = {
  "hi": "https://dummyimage.com/600x400/000/fff"
};
var xx = 0,
  yy = 0;
var sela = 0,
  selb = 0;
var mode=0;
var p=false;
var testVectorPos=null;

var angtest=0+.5;
var angtest2=-Math.PI/2+.5;

var vidmode=1;
function drawBG(ctx) {
  //ctx.fillStyle = "#000000";



  //ctx.fillRect(-10, -10, 20, 20);
}
function drawFG(ctx) {
  ctx.setLineDash([2,2]);

  ctx.strokeStyle = "lightgray";
  ctx.lineWidth = .5;
  ctx.rect(-75-.25,-75-.25,150+.5,150+.5);
  ctx.stroke();
  ctx.setLineDash([]);
  if(vidmode==0){
    frame1(ctx);
  }
  if(vidmode==1){
    frame2(ctx);
  }
  var items=["Lines, Segments, Rays, VectorPos","Direction"];
  ctx.lineWidth = .5;

  ctx.textAlign = "center";
  ctx.font = "3px Verdana";

  for(var i=0;i<items.length;i++){
    ctx.fillStyle = "hsl("+(360/items.length*i)+",100%,70%)";

    ctx.fillRect((150/items.length)*i-75, -75, 150/items.length, 8);
    ctx.fillStyle = "gray";

    ctx.fillText(items[i],(150/items.length)*i-75+(75/items.length), -75+4+3/2);
    if(i===vidmode){
      ctx.fillStyle="gray";
      ctx.fillRect((150/items.length)*i-75, -75+8-1, 150/items.length, 1);

    }
    if((150/items.length)*i-75<mouse.x&&mouse.x<(150/items.length)*(i+1)-75&&-75<mouse.y&&mouse.y<-75+8&&-75<mouse.x&&mouse.x<75){
      ctx.fillStyle = "rgba(150,150,150,.5)";

      ctx.fillRect((150/items.length)*i-75, -75, 150/items.length, 8);

      if(mouse.down){
        vidmode=i;
      }
    }

  }
  ctx.textAlign = "start";

}


function frame2(ctx){
  if(mouse.down){
    angtest=Math.atan2(mouse.y,mouse.x)
  }
  angtest+=keyboard['w']?.1:0;
  angtest-=keyboard['s']?.1:0;
  angtest2+=keyboard['e']?.1:0;
  angtest2-=keyboard['d']?.1:0;

  var testing=(new LML.Direction(angtest));
  if(keyboard[" "]){
    testing.hintTowards(Math.atan2(mouse.y,mouse.x),.99);
    angtest=testing.radians;
  }
  ctx.fillStyle = "lightgray";
  ctx.strokeStyle = "lightgray";
  new LML.Direction(testing.xy,new LML.Point(0,0)).draw(ctx);
  ctx.fillStyle = "gray";
  ctx.strokeStyle = "gray";
  (testing).draw(ctx);
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "darkblue";
  var nd=new LML.Direction(angtest2);
  nd.draw(ctx);
  var ang=new LML.Angle(nd.xy,new LML.Point(0,0),testing.xy)
  ang.draw(ctx,false);



  ctx.fillStyle = "gray";
  ctx.strokeStyle = "gray";
  ctx.font = "3px Verdana";
  ctx.fillText("DirectionA:"+testing.radians.toPrecision(3)+" radians, "+testing.degrees.toPrecision(3)+" degrees", -73, 46+26-10);

  ctx.fillText("DirectionB:"+nd.radians.toPrecision(3)+" radians, "+nd.degrees.toPrecision(3)+" degrees", -73, 46+26-5);

  ctx.fillText("Measure of Angle:"+ang.radians.toPrecision(3)+" radians, "+ang.degrees.toPrecision(3)+" degrees", -73, 46+26);

}
/*
var a= (new LML.Direction(1)).xy;
var b= (new LML.Direction(1-Math.PI)).xy;
var c= (new LML.Direction(2)).xy;
var d= (new LML.Direction(2-Math.PI)).xy;

var la=(new LML.Line(new LML.Point(a.x*8-58,a.y*8-50),
            new LML.Point(b.x*8-58,b.y*8-50)));

var lb=(new LML.Line(new LML.Point(c.x*8-58,c.y*8-50),
            new LML.Point(d.x*8-58,d.y*8-50)));
la.draw(ctx);
lb.draw(ctx)
ctx.fillStyle = "red";
ctx.strokeStyle = "red";
la.intersection(lb).draw(ctx);
*/
function frame1(ctx){

    if(keyboard[' ']){
      if(p)
      mode=((++mode)%6);
      p=false;
    }else{
      p=true;
    }

    yy += keyboard.code[40] ? 3 : 0 + keyboard.code[38] ? -3 : 0
    xx += keyboard.code[39] ? 3 : 0 + keyboard.code[37] ? -3 : 0
    var types = [LML.Line,LML.Ray,LML.LineSegment,LML.VectorPos]
    var typenames = ["line","ray","linesegment","VectorPos"]

    var canvas = document.getElementById('bg');


    ctx.font = "3px Verdana";

    //ctx.fillText(a.isect(b), -40, 50);


    switch(mode){
      case 0:
        var pts = [
          new LML.Point(-40, -10),
          new LML.Point(-30, 50),
          new LML.Point(xx,yy),
          new LML.Point(mouse.x,mouse.y ),
        ];
        break;
      case 1:
        var pts = [
          new LML.Point(-40, -10),
          new LML.Point(-10, 50),
          new LML.Point(mouse.x+15,mouse.y +30),
          new LML.Point(mouse.x,mouse.y ),
        ];
        break;
      case 2:
        var pts = [
          new LML.Point(-10, -10),
          new LML.Point(30, 40),
          new LML.Point(mouse.x,mouse.y +60),
          new LML.Point(mouse.x,mouse.y ),
        ];
        break;
      case 3:
        var pts = [
          new LML.Point(-10, -10),
          new LML.Point(-10, 50),
          new LML.Point(mouse.x,mouse.y +30),
          new LML.Point(mouse.x,mouse.y ),
        ];
        break;
      case 4:
        var pts = [
          new LML.Point(-10,yy),
          new LML.Point(-10, mouse.y),
          new LML.Point(-10, 0),
          new LML.Point(-10, 30),
        ];
        break;
      case 5:
        var pts = [
          new LML.Point(0, -10),
          new LML.Point(-20, 20),
          new LML.Point(10, -25),
          new LML.Point(-30, 35),
        ];
        break;

    }




    var a = new types[sela](pts[0], pts[1]);

    var b = new types[selb](pts[2], pts[3]);


    if(a instanceof LML.VectorPos){
      if(testVectorPos===null){
        testVectorPos=new LML.VectorPos(new LML.Point(-50, 50) ,new LML.Point(50, 10));
      }
      a=testVectorPos;

    }
    if(testVectorPos){
      testVectorPos.length+=keyboard['w']?2:0;
      testVectorPos.length-=keyboard['s']?2:0;
    }




    ctx.strokeStyle = "gray";
    ctx.fillStyle = "gray";
    a.draw(ctx, canvas);
    b.draw(ctx, canvas);
    ctx.fillText("Testing Values:"+mode, -73, 46+22);
    var n = b.intersection(a);
    ctx.fillText("Intersection: "+n, -73, 50+22);
    if (n) {
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      n.draw(ctx, canvas);
    }
    ctx.strokeStyle = "#42cef4";
    ctx.fillStyle = "#42cef4";
    a.getRayPerpendicularAt(new LML.Point(mouse.x,mouse.y)).draw(ctx, canvas);

    for (var a = 0; a < types.length; a++) {
      for (var b = 0; b < types.length; b++) {

        ctx.beginPath();
        ctx.lineWidth = .1;
        ctx.strokeStyle = "gray";
        ctx.fillStyle = "white";

        var thic = 9,
          wid = 150 / thic,
          lay = Math.floor(((a + b * types.length) * wid) / 150),
          lb = (((a + b * types.length) % thic) * wid) - (150 / 2),
          hei = (150 / -2) + lay * wid+8,
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
        ctx.fillStyle = "gray";

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
