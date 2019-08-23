/*
Larry Is Great
‾     ‾  ‾
Math library
*/
LIG = {}
LIG.length = function(a, b) {
  return (Math.hypot(a.x - b.x, a.y - b.y));
}
LIG.len = LIG.length;


LIG.getunionofintervals = function() {
  var args = arguments;
  for (var i = 0; i < args.length; i += 4) {
    var a = args[i],
      b = args[i + 1],
      c = args[i + 2],
      d = args[i + 3];
    if (Math.max(a, b) >= Math.min(c, d) && Math.max(c, d) >= Math.min(a, b)) {
      return (true)
    }

  }
  return (false);
}


LIG.point = function(x, y) {
  this.x = x;
  this.y = y;
}
LIG.p = LIG.point;

LIG.line = function(a, b) {
  this.a = a;
  this.b = b;
}



LIG.line.prototype.getSlopeInterceptForm = function() {
  if(this.a.x == this.b.x){
    return ({
      v:true
    });
  }
  var st = (this.a.y - this.b.y) / (this.a.x - this.b.x);
  return ({
    m: st,
    b: this.a.y - st * this.a.x
  });
}


LIG._llsect = function(o,b) {
  var {
    v:verta,
    m: slopea,
    b: adda
  } = b.getSlopeInterceptForm();
  var {
    v:vertb,
    m: slopeb,
    b: addb
  } = o.getSlopeInterceptForm();
  if(verta&&vertb){
    var isect = ( null)
  }else if(verta){
    var isect = (new LIG.p(b.a.x,slopeb*b.a.x+addb))
  }else if(vertb){
    var isect = (new LIG.p(o.a.x,slopea*o.a.x+adda))
  }else if(slopeb===slopea){
    var isect =null;
  }else{
    discrimd = -slopea + slopeb;
    discrimx = adda - addb;
    discrimy = slopea * -addb + slopeb * adda;
    var isect = new LIG.p(discrimx / discrimd, discrimy / discrimd);
  }
  return (isect);
}

LIG.line.prototype.intersection=function(o){

  if(o instanceof LIG.linesegment){
    var isect= LIG._llsect(this,o);
    if(isect===null)return null;

    if(Math.min(o.a.x,o.b.x)<=isect.x&&isect.x<=Math.max(o.a.x,o.b.x)){
      if(o.a.x===o.b.x){
        if(Math.min(o.a.y,o.b.y)<=isect.y&&isect.y<=Math.max(o.a.y,o.b.y)){
          return isect;
        }
      }else{
        return isect;
      }
    }else{
      return null;
    }
  }else if(o instanceof LIG.ray){
    var isect= LIG._llsect(this,o);
    if(isect===null)return null;
    if(o.a.x>=o.b.x?isect.x<=o.a.x:isect.x>=o.a.x){
      if(o.a.x===o.b.x){
        if(o.a.y>=o.b.y?isect.y<=o.a.y:isect.y>=o.a.y){
          return isect;

        }else{
          return null;

        }
      }else{
        return isect;
      }
    }else{
      return null;
    }
  }else if(o instanceof LIG.line){
    return LIG._llsect(this,o);
  }
}
LIG.line.prototype.draw=function(ctx,canvas){
  ctx.lineWidth = Math.max(.25,.25);
  ctx.strokeStyle ="gray";
  ctx.beginPath();
  ctx.moveTo(this.a.x, this.a.y);
  ctx.lineTo(this.b.x, this.b.y);
  ctx.stroke();


  ctx.beginPath();
  var ang=Math.atan2(this.b.y-this.a.y, this.b.x-this.a.x);
  ctx.moveTo(this.a.x+2*Math.cos(ang+.4), this.a.y+2*Math.sin(ang+.4));
  ctx.lineTo(this.a.x, this.a.y);
  ctx.lineTo(this.a.x+2*Math.cos(ang-.4), this.a.y+2*Math.sin(ang-.4));
  ctx.stroke();
  ctx.beginPath();

  var ang=Math.atan2(this.a.y-this.b.y, this.a.x-this.b.x);
  ctx.moveTo(this.b.x+2*Math.cos(ang+.4), this.b.y+2*Math.sin(ang+.4));
  ctx.lineTo(this.b.x, this.b.y);
  ctx.lineTo(this.b.x+2*Math.cos(ang-.4), this.b.y+2*Math.sin(ang-.4));
  ctx.stroke();
}











LIG.linesegment = function(a, b) {
  this.a = a;
  this.b = b;
}

LIG.linesegment.prototype.intersection = function(o) {
  if(o instanceof LIG.linesegment){
    var isect=LIG._llsect(this,o);
    if(isect===null)return null;

    if(Math.min(this.a.x,this.b.x)<=isect.x&&isect.x<=Math.max(this.a.x,this.b.x) &&
    Math.min(o.a.x,o.b.x)<=isect.x&&isect.x<=Math.max(o.a.x,o.b.x)){
      if(o.a.x==o.b.x){
        if(Math.min(o.a.y,o.b.y)<=isect.y&&isect.y<=Math.max(o.a.y,o.b.y)){
          return isect;
        }
      }else{
        if(this.a.x==this.b.x){
          if(Math.min(this.a.y,this.b.y)<=isect.y&&isect.y<=Math.max(this.a.y,this.b.y)){
            return isect;
          }
        }else{
          return isect;
        }
      }
    }else{
      return null;
    }
  }else if(o instanceof LIG.ray){//adsasfadfsg adfgr
    var isect=LIG._llsect(this,o);
    if(isect===null)return null;

    if(this.a.x===this.b.x){
      if((o.a.x>=o.b.x?isect.x<=o.a.x:isect.x>=o.a.x)&&
      Math.min(this.a.y,this.b.y)<=isect.y&&isect.y<=Math.max(this.a.y,this.b.y)){
        return(isect)
      }
    }else{
      if((o.a.x>=o.b.x?isect.x<=o.a.x:isect.x>=o.a.x)&&
      Math.min(this.a.x,this.b.x)<=isect.x&&isect.x<=Math.max(this.a.x,this.b.x)){
        if(o.a.x===o.b.x){
          if(o.a.y>=o.b.y?isect.y<=o.a.y:isect.y>=o.a.y){//abf
            return(isect)
          }else{
            return(null)
          }

        }else{
          return(isect)

        }
      }
    }
  }else if(o instanceof LIG.line){
    return o.intersection(this);
  }
}

LIG.linesegment.prototype.draw=function(ctx,canvas){
  ctx.lineWidth = Math.max(.25,.25);
  ctx.strokeStyle ="gray";
  ctx.beginPath();
  ctx.moveTo(this.a.x, this.a.y);
  ctx.lineTo(this.b.x, this.b.y);
  ctx.stroke();

  ctx.fillStyle ="gray";

  ctx.beginPath();
  ctx.arc(this.a.x, this.a.y, .5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();

  ctx.beginPath();
  ctx.arc(this.b.x, this.b.y, .5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
}

Object.setPrototypeOf(LIG.linesegment.prototype,LIG.line.prototype);







LIG.ray = function(a, b) {
  this.a = a;
  this.b = b;
}

LIG.ray.prototype.intersection = function(o) {
  if(o instanceof LIG.linesegment){
    return o.intersection(this);
  }else if(o instanceof LIG.ray){
    var isect=LIG._llsect(this,o);
    if(isect===null)return null;

    if((o.a.x>=o.b.x?isect.x<=o.a.x:isect.x>=o.a.x)&&(this.a.x>=this.b.x?isect.x<=this.a.x:isect.x>=this.a.x)){
      if(o.a.x===o.b.x){
        if((o.a.y>=o.b.y?isect.y<=o.a.y:isect.y>=o.a.y)){
          return(isect);
        }else{
          return(null);
        }
      }else if(this.a.x===this.b.x){
        if((this.a.y>=this.b.y?isect.y<=this.a.y:isect.y>=this.a.y)){
          return(isect);
        }else{
          return(null);
        }
      }
      return(isect);

    }
  }else if(o instanceof LIG.line){
    return o.intersection(this);
  }
}

LIG.ray.prototype.draw=function(ctx,canvas){
  ctx.lineWidth = Math.max(.25,.25);
  ctx.strokeStyle ="gray";
  ctx.beginPath();
  ctx.moveTo(this.a.x, this.a.y);
  ctx.lineTo(this.b.x, this.b.y);
  ctx.stroke();
  ctx.fillStyle ="gray";

  ctx.beginPath();
  ctx.arc(this.a.x, this.a.y, .5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();

  var ang=Math.atan2(this.a.y-this.b.y, this.a.x-this.b.x);
  ctx.moveTo(this.b.x+2*Math.cos(ang+.4), this.b.y+2*Math.sin(ang+.4));
  ctx.lineTo(this.b.x, this.b.y);
  ctx.lineTo(this.b.x+2*Math.cos(ang-.4), this.b.y+2*Math.sin(ang-.4));
  ctx.stroke();
}

Object.setPrototypeOf(LIG.ray.prototype,LIG.line.prototype)






LIG.arc = function(center,radius,startangle,finishangle){
  this.center=center;
  this.radius=radius;
  this.startangle=startangle;
  this.finishangle=finishangle;
}
LIG.arc.prototype.draw=function(ctx,canvas){
  ctx.lineWidth=.25;
  ctx.strokeStyle ="gray";
  ctx.beginPath();
ctx.arc(100, 75, 50, 0, 2 * Math.PI);
ctx.stroke();
}
