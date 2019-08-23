var LIL = function() {
  class TwoDArrayWithNegativeIndex {
    constructor() {
      this.left = null;
      this.right = null;
      this.top = null;
      this.bottom = null;
      this.obj = {};
    }
    put(c, r, itm) {
      if (!this.obj[r]) this.obj[r] = {};
      this.obj[r][c] = itm;

      this.left = this.left ? Math.min(this.left, c) : c;
      this.right = this.right ? Math.max(this.right, c) : c;
      this.top = this.top ? Math.min(this.top, r) : r;
      this.bottom = this.bottom ? Math.max(this.bottom, r) : r;
    }
    get(c, r) {
      if (!this.obj[r]) return (undefined);
      return (this.obj[r][c]);
    }
    asArray() {
      if (!this.top) return ({
        arr: []
      });
      var ret = [];
      for (var r = this.top; r <= this.bottom; r++) {
        ret[r - this.top] = [];
        for (var c = this.left; c <= this.right; c++) {
          if (this.get(c, r)) {
            ret[r - this.top][c - this.left] = this.get(c, r);
          } else {
            ret[r - this.top][c - this.left] = null;
          }
        }
      }
      return ({
        arr: ret,
        left: -this.left,
        top: -this.top
      });
    }
    toString() {
      var arr = this.asArray();
      var maxlen = 0;
      var ret = "";

      arr.arr.forEach((m) => {
        m.forEach((n) => (maxlen = Math.max(maxlen, ("" + n).length)))
      });
      arr.arr.forEach(function(m, i) {
        if (i != 0) ret += '-'.repeat((maxlen + 1) * m.length - 1) + "\n";

        m.forEach(function(n, i) {
          if (i != 0) ret += "|";

          ret += (n ? n + "" : "").padStart(maxlen, " ");
        });

        ret += "\n";
      });
      ret += "left:" + (arr.left + 1) + "  top:" + (arr.top + 1);

      return (ret);
    }
    get columns() {
      return (this.right - this.left);
    }
    get rows() {
      return (this.bottom - this.top);
    }
    fixUDLR() {
      this.left = null;
      this.right = null;
      this.top = null;
      this.bottom = null;
      this.forEach((e, c, r) => { /*Arrow function to keep this*/
        this.left = this.left ? Math.min(this.left, c) : c;
        this.right = this.right ? Math.max(this.right, c) : c;
        this.top = this.top ? Math.min(this.top, r) : r;
        this.bottom = this.bottom ? Math.max(this.bottom, r) : r;
      });
    }
    forEach(fn) {
      for (var r in this.obj) {
        for (var c in this.obj[r]) {
          fn(this.obj[r][c], c, r);
        }
      }
    }
    delete(c, r) {
      if (this.get(c, r)) {
        delete this.obj[r][c];
        if (!Object.keys(this.obj[r]).length) delete this.obj[r];
        this.fixUDLR();
      }
    }
    clear() {
      this.left = null;
      this.right = null;
      this.top = null;
      this.bottom = null;
      this.obj = {};

    }
    clone() {
      var ret = new TwoDArrayWithNegativeIndex();
      this.forEach((a, x, y) => {
        ret.put(x, y, a.clone());
      });
      return (ret);
    }
  }
  class Color {
    toString(){
      return("rgb("+this.R+","+this.G+","+this.B+")")
    }
    print(){

      console.log(this.toString()+': %c\u25A0 ',  'color:'+this.toString() );

    }
    constructor(r,g,b) {
      this.R=r;
      this.G=g;
      this.B=b;
    }
    get RGB(){
      return([this.R,this.G,this.B]);
    }
    setRGB(rgb){
      this.R=rgb[0];
      this.G=rgb[1];
      this.B=rgb[2];
    }
    get HSL(){
      return(this._RGBTOHSL(this.R,this.G,this.B));
    }
    setHSL(hsl){
      this.setRGB(this._HSLTORGB(...hsl));
    }
    get H(){
      return(this.HSL[0]);
    }
    get S(){
      return(this.HSL[1]);
    }
    get L(){
      return(this.HSL[2]);
    }
    set H(ob){
      var hsl=this.HSL;
      hsl[0]=ob;
      this.setHSL(hsl);
    }
    set S(ob){
      var hsl=this.HSL;
      hsl[1]=ob;
      this.setHSL(hsl);
    }
    set L(ob){
      var hsl=this.HSL;
      hsl[2]=ob;
      this.setHSL(hsl);
    }
    _RGBTOHSL(rr, gg, bb) {
      var r = rr / 255,
        g = gg / 255,
        b = bb / 255;
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      var l = (max + min) / 2;
      var s;
      if (max === min) {
        s = 0;
      } else if (l <= .5) {
        s = (max - min) / (max + min)

      } else {
        s = (max - min) / (2.0 - max - min)
      }
      var h;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / (max - min)
      } else if (g === max) {
        h = 2.0 + (b - r) / (max - min);
      } else if (b === max) {
        h = 4.0 + (r - g) / (max - min)
      }
      h *= 60;
      return ([((h) % 360 + 360) % 360, s, l]);
    }
    _HSLTORGB(h, s, l) {
      var c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2;
      var r = 0,
        g = 0,
        b = 0;
      if (h < 60) {
        r = c;
        g = x;
      } else if (h < 120) {
        r = x;
        g = c;
      } else if (h < 180) {
        g = c;
        b = x;
      } else if (h < 240) {
        g = x;
        b = c;
      } else if (h < 300) {
        r = x;
        b = c;
      } else {
        r = c;
        b = x;
      }
      r = (r + m) * 255;
      g = (g + m) * 255;
      b = (b + m) * 255;
      return ([r, g, b]);
    }
    lerp(percent,other){
      var nr=LML.lerp(percent,this.R,other.R);
      var ng=LML.lerp(percent,this.G,other.G);
      var nb=LML.lerp(percent,this.B,other.B);
      this.R=nr;
      this.G=ng;
      this.B=nb;
    }
    clone(){
      return(new Color(this.R,this.G,this.B))
    }
  }
  class Image {

  }
  return {
    Color: Color,
    Image: Image,
    TwoDArrayWithNegativeIndex: TwoDArrayWithNegativeIndex
  };
}();
/*
var k = new LIL.TwoDArrayWithNegativeIndex();
k.put(0, 0, "MID")
k.put(1, 1, "afds")
k.put(-3, 0, "ash")
k.put(-1, -2, "das")
k.put(3, 2, "sdf")
console.log("TOSTRING 1");
console.log(k.toString());
console.log("DELETE");
k.delete(3, 2);

console.log("TOSTRING 2");
console.log(k.toString());
console.log("DELETE");
k.delete(0, 0);

console.log("TOSTRING 3");
console.log(k.toString());
console.log("DELETE");
k.delete(-3, 0);

console.log("TOSTRING 4");
console.log(k.toString());
console.log("DELETE");
k.delete(1, 1);

console.log("TOSTRING 5");
console.log(k.toString());
console.log("DELETE");
k.delete(-1, -2);

console.log("TOSTRING 6");
console.log(k);
console.log(k.toString());


window.setInterval(function(){
  var r=Math.random()*255,g=Math.random()*255,b=Math.random()*255;
  var kk=(new LIL.Color())._HSLTORGB(...(new LIL.Color())._RGBTOHSL(r,g,b))
  var rr=kk[0],gg=kk[1],bb=kk[2];
  if(Math.abs(r-rr)>.1||Math.abs(g-gg)>.1||Math.abs(b-bb)>.1){
    console.log("bad",r,g,b);
  }else{
    console.log("good",r,g,b);

  }
},100);
*/
