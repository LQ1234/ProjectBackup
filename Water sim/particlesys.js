class TwoDArrayWithNegativeIndex {
  constructor(alwaysUpdateLRTB) {
    this.alwaysUpdateLRTB = alwaysUpdateLRTB;
    this.left = null;
    this.right = null;
    this.top = null;
    this.bottom = null;
    this.obj = {};
  }
  put(c, r, itm) {
    if (!this.obj[r]) this.obj[r] = {};
    this.obj[r][c] = itm;
    if (!this.alwaysUpdateLRTB) return;
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
    if (!this.alwaysUpdateLRTB) this.fixUDLR();
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
    if (!this.alwaysUpdateLRTB) this.fixUDLR();

    return (this.right - this.left);
  }
  get rows() {
    if (!this.alwaysUpdateLRTB) this.fixUDLR();

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
      if (this.alwaysUpdateLRTB) this.fixUDLR();
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
      if (a instanceof Array) {
        var clo = [];
        a.forEach(function(a, i) {
          clo[i] = a.clone();
        });
        ret.put(x, y, clo);
      } else {
        ret.put(x, y, a.clone());
      }
    });
    return (ret);
  }
}
class Particle {
  constructor(size, x, y, xv, yv) {
    this.x = x;
    this.y = y;
    this.xv = xv || 0;
    this.yv = yv || 0;

    this.size = size;
  }
  clone() {
    return (new Particle(this.size, this.x, this.y, this.xv, this.yv));
  }
}


/*
B.x*boxsize<=N.x<(B.x+1)*boxsize
B.y*boxsize<=N.y<(B.y+1)*boxsize

   |   |
---A---B---
   | N |
---D---C---
   |   |

*/
class Particlesys {

  constructor(func, generator, boxsize) {
    this.boxsize = boxsize;

    this.particles = new TwoDArrayWithNegativeIndex(false);
    this.generator = generator;
    this.reset();
    this.func = func;
    this.controllerData = {
      x: 0,
      y: 0,
      scale: 0,
      timeSinceUserInteraction: 1000,
      lastmouse: {
        x: 0,
        y: 0
      }
    }
  }
  clone() {
    var ret = new Particlesys(this.func, this.generator, this.boxsize);
    ret.particles = this.particles.clone();
    return (ret);
  }
  getArrayPosition(x, y) {
    return ([Math.floor(x / this.boxsize), Math.floor(y / this.boxsize)]);
  }
  add(particle) {
    var location = this.getArrayPosition(particle.x, particle.y);
    if (!this.particles.get(...location)) this.particles.put(...location, []);
    this.particles.get(...location).push(particle);
  }
  updatePositions() {
    var parts = [];
    this.particles.forEach(function(obj) {
      obj.forEach(function(x) {
        parts.push(x);

      })
    });
    this.particles.clear();
    parts.forEach((a) => {
      this.add(a);
    });
  }
  forEach(func) {
    this.particles.forEach((a) => {
      a.forEach((b) => {
        func(b);

      });

    });
  }
  remove(particle) {
    var lst = this.particles.get(...this.getArrayPosition(particle.x, particle.y));
    if (!lst) return (null);
    var pos = lst.indexOf(particle);
    if (pos == -1) return (null);
    return (lst.splice(pos, 1));
  }
  reset() {
    this.particles.clear();
    this.generator(this);
  }
  getWithinRange(pops, no) {
    var ap = this.getArrayPosition(pops.x, pops.y);
    var dst = Math.ceil(no / this.boxsize);
    var ret = [];
    for (var y = ap[1] - dst; y <= ap[1] + dst; y++) {
      for (var x = ap[0] - dst; x <= ap[0] + dst; x++) {
        if (this.particles.get(x, y)) ret = ret.concat(this.particles.get(x, y));

      }
    }
    return (ret);
  }
  tick() {
    var clone = this.clone();

    this.forEach((a) => {
      this.func(a, clone);
    });
    this.forEach((a) => {
      a.x+=a.xv;
      a.y+=a.yv;

    });
    this.updatePositions();



  }
  draw(ctx, xtranslate, ytranslate, scale, gridwidth) {
    var cut = gridwidth;
    var viewportxmin = -supposedScreenSize.x / 2 / scale + xtranslate;
    var viewportxmax = supposedScreenSize.x / 2 / scale + xtranslate;
    var viewportymin = -supposedScreenSize.y / 2 / scale + ytranslate;
    var viewportymax = supposedScreenSize.y / 2 / scale + ytranslate;
    ctx.fillStyle = 'lightgray';
    for (var x = LML.clock(0, Math.floor(viewportxmin / cut) * cut, Math.ceil(viewportxmin / cut) * cut + .001); x <= Math.ceil(viewportxmax); x += cut) {
      ctx.fillRect((x - xtranslate) * scale - .2 * scale, -supposedScreenSize.y / 2, .4 * scale, supposedScreenSize.y);
    }
    for (var y = LML.clock(0, Math.floor(viewportymin / cut) * cut, Math.ceil(viewportymin / cut) * cut + .001); y <= Math.ceil(viewportymax); y += cut) {
      ctx.fillRect(-supposedScreenSize.x / 2, (y - ytranslate) * scale - .2 * scale, supposedScreenSize.x, .4 * scale);
    }

    ctx.fillStyle = "gray";
    ctx.fillRect((-.5 - xtranslate) * scale, supposedScreenSize.y * -.5, scale, supposedScreenSize.y);
    ctx.fillRect(supposedScreenSize.x * -.5, (-.5 - ytranslate) * scale, supposedScreenSize.x, scale);
    ctx.fillStyle = "black";

    ps.getWithinRange({
      x: xtranslate,
      y: ytranslate
    }, Math.max(supposedScreenSize.x, supposedScreenSize.y) * 1.1 / 2 / scale).forEach(function(i) {
      ctx.beginPath();
      ctx.arc((i.x - xtranslate) * scale, (i.y - ytranslate) * scale, i.size * scale, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
  userControl(ctx, mousex, mousey, mousedown, scrooldiff) {

    this.controllerData.scale -= scrooldiff / 300;


    if (mousedown || scrooldiff != 0) this.controllerData.timeSinceUserInteraction = 0;

    this.controllerData.timeSinceUserInteraction++;
    if (this.controllerData.timeSinceUserInteraction >= 40) {
      this.controllerData.timeSinceUserInteraction = 100;
      var targx = 0;
      var targy = 0;
      var targscale = 0;
      var amt = 0;
      this.forEach((i) => {
        targx += i.x;
        targy += i.y;
        amt++;
      });
      targx /= amt;
      targy /= amt;

      this.forEach((i) => {
        targscale += Math.hypot(i.x - targx, i.y - targy);
        amt++;
      });
      targscale /= amt;
      targscale = 10 / targscale;
      this.controllerData.x = this.controllerData.x * .5 + targx * .5;
      this.controllerData.y = this.controllerData.y * .5 + targy * .5;
      this.controllerData.scale = this.controllerData.scale * .5 + (Math.log(targscale) / Math.log(2)) * .5;
    }
    this.controllerData.scale=Math.max(this.controllerData.scale,-3.5);
    this.controllerData.scale=Math.min(this.controllerData.scale,2);

    var scroolamount = Math.pow(2, this.controllerData.scale);

    if (mousedown) this.controllerData.x -= (mousex - this.controllerData.lastmouse.x) / scroolamount;
    if (mousedown) this.controllerData.y -= (mousey - this.controllerData.lastmouse.y) / scroolamount;
    this.controllerData.lastmouse = {
      x: mousex,
      y: mousey
    };
    this.draw(ctx, this.controllerData.x, this.controllerData.y, scroolamount, 5);
  }
}

var generators = {
  grid: function(width, height, sep) {
    return (function(partsys) {
      for (var y = 0; y <= height; y++) {
        for (var x = 0; x <= width; x++) {
          var particlexpos = (x - width / 2) * sep;
          var particleypos = (y - height / 2) * sep;

          partsys.add(new Particle(1, particlexpos, particleypos, 0, 0));
        }
      }
    });
  },
  random: function(width, height, amount) {
    return (function(partsys) {
      for(var i=0;i<amount;i++){
        var particlexpos = (Math.random()-.5) * width;
        var particleypos = (Math.random()-.5) * height;
        partsys.add(new Particle(1, particlexpos, particleypos, 0, 0));
      }
    });
  },
  randomDir: function(width, height, amount,randomness) {
    return (function(partsys) {
      for(var i=0;i<amount;i++){
        var particlexpos = (Math.random()-.5) * width;
        var particleypos = (Math.random()-.5) * height;
        partsys.add(new Particle(1, particlexpos, particleypos, (Math.random()-.5)*randomness, (Math.random()-.5)*randomness));
      }
    });
  },

  allOut:function(force, amount,randomness) {
    return (function(partsys) {
      for(var i=0;i<amount;i++){
        var dir=Math.random()*2*Math.PI;
        partsys.add(new Particle(1, 0, 0, (Math.cos(dir)*(force+Math.random()*randomness)), (Math.sin(dir)*(force+Math.random()*randomness))));
      }
    });
  },
};
