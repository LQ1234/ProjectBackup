var supposedScreenSize = {
  'x': 151.5,
  'y': 101.5
};
var crispness = 3;
var images = {
  "hi": "https://dummyimage.com/400x400/000/fff"
};

class TwoDArrayWithNegativeIndex{
  constructor(){
    this.left=null;
    this.right=null;
    this.top=null;
    this.bottom=null;
    this.obj={};
  }
  put(c,r,itm){
    if(!this.obj[r])this.obj[r]={};
    this.obj[r][c]=itm;

    this.left=this.left?Math.min(this.left,c):c;
    this.right=this.right?Math.max(this.right,c):c;
    this.top=this.top?Math.min(this.top,r):r;
    this.bottom=this.bottom?Math.max(this.bottom,r):r;
  }
  get(c,r){
    if(!this.obj[r])return(undefined);
    return(this.obj[r][c]);
  }
  asArray(){
    if(!this.top)return({arr:[]});
    var ret=[];
    for(var r=this.top;r<=this.bottom;r++){
      ret[r-this.top]=[];
      for(var c=this.left;c<=this.right;c++){
        if(this.get(c,r)){
          ret[r-this.top][c-this.left]=this.get(c,r);
        }else{
          ret[r-this.top][c-this.left]=null;
        }
      }
    }
    return({arr:ret,left:-this.left,top:-this.top});
  }
  toString(){
    var arr=this.asArray();
    var maxlen=0;
    var ret="";

    arr.arr.forEach((m)=>{m.forEach((n)=>(maxlen=Math.max(maxlen,(""+n).length)))});
    arr.arr.forEach(function(m,i){
      if(i!=0)ret+='-'.repeat((maxlen+1)*m.length-1)+"\n";

      m.forEach(function(n,i){
        if(i!=0)ret+="|";

        ret+=(n?n+"":"").padStart(maxlen," ");
      });

      ret+="\n";
    });
    ret+="left:"+(arr.left+1)+"  top:"+(arr.top+1);

    return(ret);
  }
  get columns(){
    return(this.right-this.left);
  }
  get rows(){
    return(this.bottom-this.top);
  }
  fixUDLR(){
    this.left=null;
    this.right=null;
    this.top=null;
    this.bottom=null;
    this.forEach((e,c,r)=>{/*Arrow function to keep this*/
      this.left=this.left?Math.min(this.left,c):c;
      this.right=this.right?Math.max(this.right,c):c;
      this.top=this.top?Math.min(this.top,r):r;
      this.bottom=this.bottom?Math.max(this.bottom,r):r;
    });
  }
  forEach(fn){
    for (var r in this.obj) {
      for (var c in this.obj[r]) {
        fn(this.obj[r][c],c,r);
      }
    }
  }
  delete(c,r){
    if(this.get(c,r)){
      delete this.obj[r][c];
      if(!Object.keys(this.obj[r]).length)delete this.obj[r];
      this.fixUDLR();
    }
  }
  clear(){
    this.left=null;
    this.right=null;
    this.top=null;
    this.bottom=null;
    this.obj={};

  }
  clone(){
    var ret=new TwoDArrayWithNegativeIndex();
    this.forEach((a,x,y)=>{
      ret.put(x,y,a.clone());
    });
    return(ret);
  }
}

function drawBG(ctx) {

}

var lines=[new LML.Line(new LML.Point(-10,20),new LML.Point(40,0)),
           new LML.Line(new LML.Point(-40,-20),new LML.Point(10,0))];
var linewidth=1;
var worldsize={x:120,y:80};
var worlds=[];



function drawFG(ctx) {
  ctx.beginPath();

  ctx.strokeStyle = "lightgray";
  ctx.fillStyle = "lightgray";
  ctx.font = "1.2px Verdana";

  ctx.lineWidth = .5;
  //ctx.rect(-75-.25,-50-.25,150+.5,100+.5);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = .1;
  for (var xx = -75; xx <= 75; xx+=150/worldsize.x) {
      ctx.beginPath();
      ctx.moveTo(xx, 50);
      ctx.lineTo(xx, -50);
      ctx.stroke();


  }
  ctx.textAlign = "end";
  for (var yy = -50; yy <= 50; yy+=100/worldsize.y) {
    ctx.beginPath();
    ctx.moveTo(-75, yy);
    ctx.lineTo(75, yy);
    ctx.stroke();
  }
  ctx.lineWidth = .3;
  ctx.beginPath();
  ctx.moveTo(-75, 0);
  ctx.lineTo(75, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.lineTo(0, -50);
  ctx.stroke();
  ctx.textAlign = "start";

  ctx.strokeStyle = "black";

  var scx=150/worldsize.x;
  var scy=100/worldsize.y;

  for (var i = 0; i < lines.length; i++) {
    ctx.lineWidth = linewidth*scx;

    ctx.beginPath();
    ctx.moveTo(lines[i].pointA.x*scx, lines[i].pointA.y*scy);
    ctx.lineTo(lines[i].pointB.x*scx, lines[i].pointB.y*scy);
    ctx.stroke();
  }
  for (var i = 0; i < worlds.length; i++) {
    ctx.fillStyle = "lightblue";

    worlds[i].array.forEach(function(vs,x,y){
      ctx.fillRect(x*scx,y*scy,scx,scy);
    });

  }
}



class World{
  constructor(sxm,sym,sxma,syma){
    this.array=new TwoDArrayWithNegativeIndex();
    this.sxm=sxm;
    this.sym=sym;
    this.sxma=sxma;
    this.syma=syma;

  }
  mouseInput(mx,my){
  }
  step(){
    var past=this.array.clone();
    /*gravity*/
    var gravity=new LML.Vector(new LML.Direction(0),1);
    this.array.forEach((a,x,y)=>{
      this.array.put(x,y,past.get(x,y).plus(gravity))
    });
    /*collision*/
    /*box*/
    var nn=this.array.clone();

    this.array.clear();

    nn.forEach((a,x,y)=>{
      var nx=x+a.xy.x,ny=y+a.xy.y;
      if(this.sxm<=nx&&nx<=this.sxma&&this.sym<=ny&&ny<=this.syma)
      this.array.put(x+a.xy.x,y+a.xy.y,a);
    });
  }
}
class WorldA extends World{
  mouseInput(mx,my){
    this.array.put(mx  ,my,new LML.Vector(new LML.Direction(0),0))
    this.array.put(mx+1,my,new LML.Vector(new LML.Direction(0),0))
    this.array.put(mx-1,my,new LML.Vector(new LML.Direction(0),0))
    this.array.put(mx,my+1,new LML.Vector(new LML.Direction(0),0))
    this.array.put(mx,my-1,new LML.Vector(new LML.Direction(0),0))

  }

}

worlds.push(new WorldA(worldsize.x*-.5,worldsize.y*-.5,worldsize.x*.5,worldsize.y*.5));

function tick(){
  var scx=150/worldsize.x;
  var scy=100/worldsize.y;

  for (var i = 0; i < worlds.length; i++) {
    worlds[i].step();

    if(mouse.down){
      worlds[i].mouseInput(Math.floor(mouse.fg.x/scx),Math.floor(mouse.fg.y/scy));
    }
  }
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
  'bg':{
    'x':0,
    'y':0
    },
  'fg':{
    'x':0,
    'y':0
    },
  'down': false
}
var keyboard = {
  code: {

  }
}
window.setInterval(draw, 50);
window.setInterval(tick, 50);

window.onresize = draw;

function handleMouseEvent(x, y) {
  var canvas = document.getElementById('bg');
  var scale;
  scale = supposedScreenSize.x / supposedScreenSize.y > canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  mouse.fg.x = (x - window.innerWidth / 2) / scale * crispness;
  mouse.fg.y = (y - window.innerHeight / 2) / scale * crispness;
  scale = supposedScreenSize.x / supposedScreenSize.y < canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  mouse.bg.x = (x - window.innerWidth / 2) / scale * crispness;
  mouse.bg.y = (y - window.innerHeight / 2) / scale * crispness;
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
