var LML = function() {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    clone() {
      return new Point(this.x, this.y);
    }
    toString() {
      return ("(" + this.x + "," + this.y + ")")
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, .8, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function distance(a, b) {
    return (Math.hypot(a.x - b.x, a.y - b.y))
  }


  function intersectionWithType(a, b) {
    function fastPointInRay(a, b, point) { /*Assumes point is on line of ray*/
      if (a.x == b.x) {
        return (a.y >= b.y ? point.y < a.y : point.y > a.y);
      } else {
        return (a.x >= b.x ? point.x < a.x : point.x > a.x);
      }
    }

    function intInBetween(p, a, b) {
      return (Math.min(a, b) < p && p < Math.max(a, b));
    }

    function getInnerOutPoints(a1, a2, b1, b2) { /*Assumes lines overlap*/
      return ([a1, a2, b1, b2].sort((a, b) => (((a.x === b.x) ? (a.y > b.y) : (a.x > b.x)) ? 1 : -1)));
    }

    function segsInBetween(a1, a2, b1, b2) { /*Assumes lines overlap*/
      if (a1 > a2) return (segsInBetween(a2, a1, b1, b2));
      if (b1 > b2) return (segsInBetween(a1, a2, b2, b1));
      return (a2 > b1 && b2 > a1);
    }

    if (a instanceof Line) {
      if (b instanceof Line) {
        /*Line,Line*/
        return (a._intersection(b));
      }
      if (b instanceof Ray) {
        /*Line,Ray*/

        if (a.isDependent(b)) {
          return (b.clone())
        }
        var isect = a._intersection(b);
        if (isect === null) {
          return null;
        }
        if (fastPointInRay(b.pointA, b.pointB, isect)) {
          return isect;
        }
      }
      if (b instanceof LineSegment) { /*a line,b seg*/
        if (a.isDependent(b)) {
          return (b);
        }
        var isect = a._intersection(b);
        if (isect === null) {
          return null;
        }

        if (b.isVertical ? intInBetween(isect.y, b.pointA.y, b.pointB.y) : intInBetween(isect.x, b.pointA.x, b.pointB.x))
          return (isect);
        return (null);
      }


    } else if (a instanceof Ray) {
      if (b instanceof Line) {
        return intersectionWithType(b, a);
      }
      if (b instanceof Ray) {
        /*Ray,Ray*/

        if (a.isDependent(b)) {
          if (a.isVertical) { /*a and b are both*/
            if (a.isOnTopOf(b)) {
              if (a.isDown && b.isUp) {
                return new LineSegment(a.pointA, b.pointA);
              } else if (a.isUp && b.isDown) {
                return null;
              } else if (a.isUp && b.isUp) {
                return (a.clone());
              } else if (a.isDown && b.isDown) {
                return (b.clone());
              }
            } else {
              if (b.isDown && a.isUp) {
                return new LineSegment(b.pointA, a.pointA);
              } else if (b.isUp && a.isDown) {
                return null;
              } else if (b.isUp && a.isUp) {
                return (b.clone());
              } else if (b.isDown && a.isDown) {
                return (a.clone());
              }
            }
          } else {
            if (a.isOnLeftOf(b)) {
              if (a.isRight && b.isLeft) {
                return new LineSegment(a.pointA, b.pointA);
              } else if (a.isLeft && b.isRight) {
                return null;
              } else if (a.isLeft && b.isLeft) {
                return (a.clone());
              } else if (a.isRight && b.isRight) {
                return (b.clone());
              }
            } else {
              if (b.isRight && a.isLeft) {
                return new LineSegment(b.pointA, a.pointA);
              } else if (b.isLeft && a.isRight) {
                return null;
              } else if (b.isLeft && a.isLeft) {
                return (b.clone());
              } else if (b.isRight && a.isRight) {
                return (a.clone());
              }
            }
          }

        }
        var isect = a._intersection(b);
        if (isect === null) {
          return null;
        }
        if (fastPointInRay(a.pointA, a.pointB, isect) && fastPointInRay(b.pointA, b.pointB, isect)) {
          return isect;
        }

      }
      if (b instanceof LineSegment) {
        /*Ray,Segment*/
        if (a.isDependent(b)) {
          if(a.isVertical){
            if(a.pointA.y>b.pointA.y&&a.pointA.y>b.pointB.y){
              if(a.pointA.y>a.pointB.y){
                return(b.clone())
              }else{
                return(null)
              }
            }else if(a.pointA.y<b.pointA.y&&a.pointA.y<b.pointB.y){
              if(a.pointA.y<a.pointB.y){
                return(b.clone())
              }else{
                return(null)
              }
            }
            if(a.pointA.y>a.pointB.y){

              return(new LineSegment(a.pointA,b.pointA.y>b.pointB.y?b.pointB:b.pointA));
            }else{
              return(new LineSegment(a.pointA,b.pointA.y<b.pointB.y?b.pointB:b.pointA));

            }
          }else{
            if(a.pointA.x>b.pointA.x&&a.pointA.x>b.pointB.x){
              if(a.pointA.x>a.pointB.x){
                return(b.clone())
              }else{
                return(null)
              }
            }else if(a.pointA.x<b.pointA.x&&a.pointA.x<b.pointB.x){
              if(a.pointA.x<a.pointB.x){
                return(b.clone())
              }else{
                return(null)
              }
            }
            if(a.pointA.x>a.pointB.x){

              return(new LineSegment(a.pointA,b.pointA.x>b.pointB.x?b.pointB:b.pointA));
            }else{
              return(new LineSegment(a.pointA,b.pointA.x<b.pointB.x?b.pointB:b.pointA));

            }
          }

        }
        var isect = a._intersection(b);
        if (isect === null) {
          return null;
        }

        if ((fastPointInRay(a.pointA,a.pointB,isect)) &&
          (b.isVertical ? intInBetween(isect.y, b.pointA.y, b.pointB.y) : intInBetween(isect.x, b.pointA.x, b.pointB.x)))
          return (isect);
        return (null);
      }
    } else if (a instanceof LineSegment) { /*DONE*/
      if (b instanceof Line) {
        return intersectionWithType(b, a);
      }
      if (b instanceof Ray) {
        return intersectionWithType(b, a);
      }
      if (b instanceof LineSegment) {
        /*Segment,Segment*/
        if (a.isDependent(b)) {
          var getInsect = getInnerOutPoints(a.pointA, a.pointB, b.pointA, b.pointB);
          if (a.isVertical ? segsInBetween(a.pointA.y, a.pointB.y, b.pointA.y, b.pointB.y) :
            segsInBetween(a.pointA.x, a.pointB.x, b.pointA.x, b.pointB.x)) return (new LineSegment(getInsect[1], getInsect[2]));
          return (null);
        }
        var isect = a._intersection(b);
        if (isect === null) {
          return null;
        }

        if ((a.isVertical ? intInBetween(isect.y, a.pointA.y, a.pointB.y) : intInBetween(isect.x, a.pointA.x, a.pointB.x)) &&
          (b.isVertical ? intInBetween(isect.y, b.pointA.y, b.pointB.y) : intInBetween(isect.x, b.pointA.x, b.pointB.x)))
          return (isect);
        return (null);
      }
    }
  }
  class TwoPointBase {
    constructor(a, b) {
      if (a instanceof TwoPointBase) {
        this.pointA = a.pointA;
        this.pointB = a.pointB;
      } else {
        this.pointA = a;
        this.pointB = b;
      }
    }
    getRayPerpendicularAt(point){
      if(this.isHorizontal){
        return(new Ray(new Point(point.x,this.pointA.y),point.clone()));
      }else{
        var perpSlope=-1/this.slope;
        var asLine=new Line(this);
        var lineOfPerp=new Line(new Point(point.x+1,point.y+perpSlope),point);
        return(new Ray(lineOfPerp.intersection(asLine),point.clone()));

      }
    }
    flip(){
      var res=this.pointA;
      this.pointA=this.pointB;
      this.pointB=res;
    }
    getDirection(){
      return(new Direction(this.pointA,this.pointB));
    }
    getUpperPoint(){
      return(this.isUp?this.pointA:this.pointB);
    }
    getLowerPoint(){
      return(this.isDown?this.pointA:this.pointB);
    }
    get isUp() {
      return (this.pointA.y > this.pointB.y);
    }
    get isLeft() {
      return (this.pointA.x > this.pointB.x);
    }
    get isDown() {
      return (this.pointA.y < this.pointB.y);
    }
    get isRight() {
      return (this.pointA.x < this.pointB.x);
    }
    isOnTopOf(oRay) {
      return (this.pointA.y < oRay.pointA.y);
    }
    isOnLeftOf(oRay) {
      return (this.pointA.x < oRay.pointA.x);
    }
    isOnBottomOf(oRay) {
      return (this.pointA.y > oRay.pointA.y);
    }
    isOnRightOf(oRay) {
      return (this.pointA.x > oRay.pointA.x);
    }
    toString() {
      return (this.constructor.name + ":" + this.pointA + "," + this.pointB)
    }
    get length() {
      return (distance(this.pointA, this.pointB));
    }
    clone() {
      return new this.constructor(this.pointA.clone(), this.pointB.clone())
    }
    at(x) {
      if (this.isVertical) {
        return (null);
      }
      return (this.slope * x + this.yIntercept);
    }
    get slope() {
      return (this.pointA.y - this.pointB.y) / (this.pointA.x - this.pointB.x);
    }
    get yIntercept() {
      return (this.pointA.y - this.slope * this.pointA.x);
    }
    get isVertical() {
      return (this.pointA.x === this.pointB.x);
    }
    get isHorizontal() {
      return (this.pointA.y === this.pointB.y);
    }
    isParallel(other) {
      return ((this.isVertical && other.isVertical) || (this.slope === other.slope))
    }
    isDependent(other) {
      return ((this.isVertical && other.isVertical) ? this.pointA.x === other.pointA.x :
        (this.slope === other.slope && this.yIntercept === other.yIntercept))

    }
    intersection(other) {
      return intersectionWithType(this, other);
    }
    _intersection(other) {

      if (this.isDependent(other)) {
        return (this.clone());
      } else if (this.isParallel(other)) {
        return (null);
      } else if (this.isVertical) {
        return (new Point(this.pointA.x, other.at(this.pointA.x)))
      } else if (other.isVertical) {
        return (new Point(other.pointA.x, this.at(other.pointA.x)))
      } else {
        var discrimd = -this.slope + other.slope;
        var discrimx = this.yIntercept - other.yIntercept;
        var discrimy = this.slope * -other.yIntercept + other.slope * this.yIntercept;
        return new Point(discrimx / discrimd, discrimy / discrimd);
      }
      return (isect);
    }


  }

  class Line extends TwoPointBase {
    draw(ctx) {
      ctx.lineWidth = .25;
      ctx.beginPath();
      ctx.moveTo(this.pointA.x, this.pointA.y);
      ctx.lineTo(this.pointB.x, this.pointB.y);
      ctx.stroke();

      ctx.beginPath();
      var ang = Math.atan2(this.pointB.y - this.pointA.y, this.pointB.x - this.pointA.x);
      ctx.moveTo(this.pointA.x + 2 * Math.cos(ang + .4), this.pointA.y + 2 * Math.sin(ang + .4));
      ctx.lineTo(this.pointA.x, this.pointA.y);
      ctx.lineTo(this.pointA.x + 2 * Math.cos(ang - .4), this.pointA.y + 2 * Math.sin(ang - .4));
      ctx.stroke();
      ctx.beginPath();

      var ang = Math.atan2(this.pointA.y - this.pointB.y, this.pointA.x - this.pointB.x);
      ctx.moveTo(this.pointB.x + 2 * Math.cos(ang + .4), this.pointB.y + 2 * Math.sin(ang + .4));
      ctx.lineTo(this.pointB.x, this.pointB.y);
      ctx.lineTo(this.pointB.x + 2 * Math.cos(ang - .4), this.pointB.y + 2 * Math.sin(ang - .4));
      ctx.stroke();
    }



  }
  class Ray extends TwoPointBase {
    draw(ctx) {
      ctx.lineWidth = .25;

      ctx.beginPath();
      ctx.moveTo(this.pointA.x, this.pointA.y);
      ctx.lineTo(this.pointB.x, this.pointB.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.pointA.x, this.pointA.y, .5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();

      var ang = Math.atan2(this.pointA.y - this.pointB.y, this.pointA.x - this.pointB.x);
      ctx.moveTo(this.pointB.x + 2 * Math.cos(ang + .4), this.pointB.y + 2 * Math.sin(ang + .4));
      ctx.lineTo(this.pointB.x, this.pointB.y);
      ctx.lineTo(this.pointB.x + 2 * Math.cos(ang - .4), this.pointB.y + 2 * Math.sin(ang - .4));
      ctx.stroke();
    }
  }
  class LineSegment extends TwoPointBase {
    draw(ctx) {
      ctx.lineWidth = .25;

      ctx.beginPath();
      ctx.moveTo(this.pointA.x, this.pointA.y);
      ctx.lineTo(this.pointB.x, this.pointB.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.pointA.x, this.pointA.y, .5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();

      ctx.arc(this.pointB.x, this.pointB.y, .5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  class VectorPos extends LineSegment{
    get length(){
      return(distance(this.pointA, this.pointB));
    }
    set length(len){
      if(this.isVertical){
        this.pointB.y=this.pointA.y+(this.pointA.y>this.pointB.y?len:-len);
      }else{
        var slope=this.slope;
        var xd=len/(Math.sqrt(1+slope*slope));
        if(this.isRight)xd*=-1;
        this.pointB.x=this.pointA.x+(xd)
        this.pointB.y=this.pointA.y+(xd*slope)

      }
      //console.log(len);
    }

    draw(ctx) {
      ctx.lineWidth = .25;
      ctx.beginPath();
      ctx.arc(this.pointA.x, this.pointA.y, .5, 0, 2 * Math.PI);
      ctx.fill();
      var ang = Math.atan2(this.pointA.y - this.pointB.y, this.pointA.x - this.pointB.x);
      var extX=this.pointB.x - 2 * Math.cos(ang);
      var extY=this.pointB.y - 2 * Math.sin(ang);
      ctx.beginPath();
      ctx.moveTo(this.pointA.x, this.pointA.y);
      ctx.lineTo(extX, extY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(extX + 2 * Math.cos(ang + .4), extY + 2 * Math.sin(ang + .4));
      ctx.lineTo(extX, extY);
      ctx.lineTo(extX + 2 * Math.cos(ang - .4), extY + 2 * Math.sin(ang - .4));
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.pointB.x, this.pointB.y, .5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  function map(m,a,b,c,d){
    return((m-a)/(b-a)*(d-c)+c);
  }
  function withinRange(m,a,b){
    return(Math.max(Math.min(m,Math.max(a,b)),Math.min(a,b)));
  }
  function clock(a,b,c){
    if(b>c)return(clock(a,c,b));
    return(a+Math.ceil((b-a)/(c-b))*(c-b));
  }
  function lerp(a,b,c){
    return(b+a*(c-b));
  }
  function rangeAngle(ang){
    return(clock(ang,-Math.PI,Math.PI));
  }

  class Direction{
    clone(){
      return(new Direction(this.angle));
    }
    draw(ctx){
      new Ray(new Point(0,0),new Point(this.xy.x*50,this.xy.y*50)).draw(ctx);
    }
    constructor(a,b){
      if(a instanceof Point){
        this.angle=Math.atan2((b.y-a.y), (b.x-a.x));
      }else if(a instanceof Ray||a instanceof VectorPos){
        constructor(a.pointA,a.pointB);
      }else{
        this.angle=a;
      }
    }
    hintTowards(newAngle,stay){
      this.angle=rangeAngle(this.angle-newAngle)*stay+newAngle;
    }
    nice(){
      this.angle=rangeAngle(this.angle);
    }
    get degrees(){
      this.nice();
       return(this.angle*(180/Math.PI))
    }
    set degrees(x){
      this.angle=x/(180/Math.PI);
    }
    get radians(){
      this.nice();

      return(this.angle);
    }

    set radians(x){
      this.angle=x;
    }
    get xy(){
      return (new Point(Math.cos(this.angle),Math.sin(this.angle)));
    }

  }
  class Angle{
    draw(ctx,drawarms){
      if(drawarms){
        new Ray(this.vertex,new Point(this.directionA.xy.x*20+this.vertex.x,this.directionA.xy.y*20+this.vertex.y)).draw(ctx);
        new Ray(this.vertex,new Point(this.directionB.xy.x*20+this.vertex.x,this.directionB.xy.y*20+this.vertex.y)).draw(ctx);
      }
      ctx.beginPath();

      ctx.arc(this.vertex.x,this.vertex.y,10,this.directionA.radians,this.directionB.radians);
      ctx.stroke();

    }
    constructor(a,b,c){
      this.vertex=b;

      this.directionA=new Direction(this.vertex,a);
      this.directionB=new Direction(this.vertex,c);
    }
    get radians(){
      return(clock(this.directionB.radians-this.directionA.radians,0,2*Math.PI));
    }
    get degrees(){
      return(this.radians*(180/Math.PI));
    }
  }
  class Vector{
    clone(){
      var ret=new Vector();
      ret.direction=this.direction.clone();
      ret.magnitude=this.magnitude;
      return(ret);
    }
    constructor(a,b){
      if(a instanceof Direction){
        if(b>0){
          this.direction=a;
          this.magnitude=b;
        }else{
          this.direction=new Direction(a.radians+Math.PI);
          this.magnitude=-b;
        }

      }else if(a instanceof Point){
        this.direction=new Direction(new LML.Point(0,0),a);
        this.magnitude=distance(new LML.Point(0,0),a);
      }
    }
    get opposide(){
      return(new Vector(this.direction),-this.magnitude);
    }
    get xy(){
      console.log(this.direction);

      var xy=this.direction.xy;
      return(new Point(xy.x*this.magnitude,xy.y*this.magnitude));
    }
    plus(other){
      var thisxy=this.xy;
      var otherxy=other.xy;
      thisxy.x+=otherxy.x;
      thisxy.y+=otherxy.y;
      return(new Vector(thisxy));
    }

  }
  return {
    map:map,
    withinRange:withinRange,
    clock:clock,
    lerp:lerp,
    Vector:Vector,
    distance: distance,
    Point: Point,
    Line: Line,
    Ray: Ray,
    LineSegment: LineSegment,
    VectorPos:VectorPos,
    Angle:Angle,
    Direction:Direction,
  };
}();
