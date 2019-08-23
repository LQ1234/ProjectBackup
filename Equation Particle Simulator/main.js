var particlePV;
var particleT;
window.addEventListener('load',function() {
  var running = true;
  var timeTaken = 0;
  var snaps = 0;
  window.setTimeout(step, 1);

  function step() {
    var start = performance.now();
    draw();

    var end = performance.now();
    snaps++;
    timeTaken += end - start;
    window.setTimeout(step, 1);
  }
  document.addEventListener("keypress", function onEvent(event) {
    if (event.key === " ") {
      running = !running;
    } else if (event.key === "l") {
      linesPP = new Float32Array([mouseclickX, mouseclickY, mousemoveX, mousemoveY]);
      lines = 1;
      intersectionTimes[0] = 0;

    } else if (event.key === "p") {
      particlePV = new Float32Array([mouseclickX, mouseclickY, (mousemoveX - mouseclickX) / 5, (mousemoveY - mouseclickY) / 5]);
      particleT[0] = 0;
      intersectionTimes[0] = 0;

    } else if (event.key === "u") {

      for(var i=0;i<particles;i++){
        updateParticle(i, linesPP, particles, intersectionTimes, intersectionLine, particlePV, particleT,10,0);
      }
    }
  });
  window.setInterval(
    function() {
      console.log(timeTaken / snaps);
      timeTaken = 0;
      snaps = 0;
    }
  , 1000);

  var mousemoveX, mousemoveY, mouseclickX, mouseclickY;
  const canvas = document.getElementById('canvas');
  canvas.addEventListener('mousemove', event => {
    var bound = canvas.getBoundingClientRect();
    mousemoveX = event.clientX - bound.left - 250;
    mousemoveY = event.clientY - bound.top - 250;
    mousemoveY *= -1;
  });
  canvas.addEventListener('click', event => {
    mouseclickX = mousemoveX;
    mouseclickY = mousemoveY;
  });


  var linesPP = new Float32Array([
    -250, -50, -100, -50,
    250, -50, 100, -50,
    -100, -50, -100, 50,
    100, -50, 100, 50,
    -100, 50, 0, 150,
    100, 50, 0, 150,
    -180, 120, -120, 120,
    -180, 120, -180, 180,
    -180, 180, -120, 180,
    -120, 180, -120, 120,
    -250, -50, -250, 250,
    250, -50, 250, 250,
    -250, 250, 250, 250,
  ]);
  var lines = linesPP.length / 4,
    particles = 100000;
  var intersectionTimes = new Float32Array(particles);
  var intersectionLine = new Float32Array(particles);
  particlePV = new Float32Array(particles * 4);
  particleT = new Float32Array(particles);

  var lastStepTime = performance.now();
  for (var i = 0; i < particles; i++) {
    particleT[i] = 0;
    particlePV[i * 4] = (Math.random() - .5) * 500;
    particlePV[i * 4 + 1] = 200;
    particlePV[i * 4 + 2] = (Math.random() - .5) * 20;
    particlePV[i * 4 + 3] = (Math.random() - .5) * 80;
  }

  function draw() {
    "use strict";
    render();

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.width;
    ctx.strokeRect(0, 0, 500, 500);

    ctx.translate(250, 250);
    ctx.scale(1, -1);

    ctx.lineWidth = 2;

    for (var i = 0; i < lines; i++) {

      ctx.strokeStyle = 'black';


      ctx.beginPath();
      ctx.moveTo(linesPP[i * 4 + 0], linesPP[i * 4 + 1]);
      ctx.lineTo(linesPP[i * 4 + 2], linesPP[i * 4 + 3]);
      ctx.stroke();
    }

    /*


    for (var i = 0; i < particles; i++) {
      ctx.fillStyle = 'black';

      ctx.beginPath();
      ctx.arc(particlePV[4 * i] + particleT[i] * particlePV[4 * i + 2], -(particleT[i] * particleT[i]) + particlePV[4 * i + 3] * particleT[i] + particlePV[4 * i + 1], 2, 0, 2 * Math.PI, true);
      ctx.fill();


    }*/

    var timeDiffrence = performance.now() - lastStepTime;
    timeDiffrence=Math.min(timeDiffrence,10);
    if (running)
      tick(timeDiffrence / 200, linesPP, particles, intersectionTimes, intersectionLine, particlePV, particleT)
    lastStepTime = performance.now();
  }
});
/*[{sx:..,sy:..,ex:..,ey:..}]*/
/*
function sortAdd(convertTo,current,comparator){
  var changed = [];
  var toAdd = [];
  var iT = 0;
  var iC = 0;

  while (iT < convertTo.length && iC < current.length) {
    //console.log("Index: \nconvertTo: " + iT + " current: " + iC);
    //console.log("convertTo:", convertTo, "\ncurrent:", current, "\ntoAdd:", toAdd, "\nChanged:", changed);

    if (comparator(convertTo[iT] , current[iC])===0) {
      //console.log("Equal so both added");
      iT++;
      iC++;

    } else if (comparator(convertTo[iT] , current[iC])>0) {
      changed.push(iC);
      //console.log("current smaller so set null");
      current[iC] = null;
      iC++;

    } else if (comparator(convertTo[iT] , current[iC])<0) {
      //console.log("convertTo smallerso added");
      toAdd.push(convertTo[iC]);
      iT++;
    }

  }


  for(var i=0;i<current.length;i++){
    if(current[i]===null){
      current[i]=toAdd.shift();
    }
  }
  for(var i=0;i<toAdd.length;i++){
    current.push(toAdd[i]);
	changed.push(i);
  }
    console.log("convertTo:", convertTo, "\ncurrent:", current, "\ntoAdd:", toAdd, "\nChanged:", changed);
  return(changed);
}

function updateLines(newLines, linesPP, particles, intersectionTimes, intersectionLine, particlePV, particleT){
  var currentlines=[];
  for (var i = 0; i < linesPP.length; i+=4) {
    currentlines.push({sx:linesPP[i],sy:linesPP[i+1],ex:linesPP[i+2],ey:linesPP[i+3]});
  }
  function sortLines(a,b){
    if(a.sx>b.sx)return(1);
    if(a.sx<b.sx)return(-1);

    if(a.sy>b.sy)return(1);
    if(a.sy<b.sy)return(-1);

    if(a.ex>b.ex)return(1);
    if(a.ex<b.ex)return(-1);
    return(a.ey-b.ey);
  }
  newLines.sort(sortLines);
  currentlines.sort(sortLines);
  var changed=sortAdd(newLines,currentlines,sortLines);



  for (var p = 0; p < particlePV.length; p++) {
    for (var l = 0; l < linesPP.length; l++) {

    var isectTime = getInteraction(particlePV.slice(4 * p, 4 * p + 4), linesPP.slice(4 * l, 4 * l + 4), true);
    if (isectTime != null) {
      if (min === null || min > isectTime) {
        min = isectTime;
        mline = l;
      }
    }}
  }
}
*/
function updateParticle(particleToUpdate, linesPP, particles, intersectionTimes, intersectionLine, particlePV, particleT,ax,ay) {
  var part = particlePV.slice(4 * particleToUpdate, 4 * particleToUpdate + 4);
  var nl = interactionHelperFunctions.getLocationAt(particleT[particleToUpdate], ...part);


  particlePV[4 * particleToUpdate] = nl[0];
  particlePV[4 * particleToUpdate + 1] = nl[1];
  particlePV[4 * particleToUpdate + 2] = part[2]+ax;

  if (part[2] === 0) {
    var slope = interactionHelperFunctions.getSlopeAt(particleT[particleToUpdate], -1, part[3], 0);
    particlePV[4 * particleToUpdate + 3] = slope+ay;

  } else {
    var slope = interactionHelperFunctions.getSlopeAt(nl[0], ...interactionHelperFunctions.getEquationOf(...part));
    particlePV[4 * particleToUpdate + 3] = slope * part[2]+ay;

  }

  intersectionTimes[particleToUpdate] = 0;
  particleT[particleToUpdate] = 0;
}

function tick(timeDiffrence, linesPP, particles, intersectionTimes, intersectionLine, particlePV, particleT) {

  for (var p = 0; p < particlePV.length; p++) {
    if (intersectionTimes[p] === 0 && particleT[p] > 0) {
      var min = null;
      var mline = null;
      for (var l = 0; l < linesPP.length; l++) {
        if (linesPP[4 * l] === linesPP[4 * l + 2] && linesPP[4 * l + 1] === linesPP[4 * l + 3]) continue;
        var isectTime = getInteraction(particlePV.slice(4 * p, 4 * p + 4), linesPP.slice(4 * l, 4 * l + 4), true);
        if (isectTime != null) {
          if (min === null || min > isectTime) {
            min = isectTime;
            mline = l;
          }
        }
      }
      if (min !== null) {
        intersectionTimes[p] = min;
        intersectionLine[p] = mline;
      }
    }
  }

  for (var i = 0; i < particlePV.length; i++) {
    if (particleT[i] >= 0) particleT[i] += timeDiffrence;
  }
  for (var p = 0; p < particlePV.length; p++) {
    if (particleT[p] > intersectionTimes[p] && intersectionTimes[p] != 0 && particleT[p] >= 0) {
      var isectLoc = getInteraction(particlePV.slice(4 * p, 4 * p + 4), linesPP.slice(4 * intersectionLine[p], 4 * intersectionLine[p] + 4));
      particlePV[4 * p] = isectLoc[0];
      particlePV[4 * p + 1] = isectLoc[1];

      particlePV[4 * p + 2] = isectLoc[2];
      particlePV[4 * p + 3] = isectLoc[3];

      particleT[p] = .1;
      intersectionTimes[p] = 0;
    }
  }
}


function getInteraction(particle, line, justTime) {
  if (Math.abs(particle[2]) < .001) particle[2] = 0.002; //'quick' fix
  if (line[0] === line[2]) line[0] += 0.001;

  if (line[0] > line[2]) {
    var ts = line[0];
    line[0] = line[2];
    line[2] = ts;
    ts = line[1];
    line[1] = line[3];
    line[3] = ts;
  }
  if (particle[2] > 0) {
    if (particle[0] > line[2]) return (null);
  } else {
    if (particle[0] < line[0]) return (null);
  }
  if (particle[3] < 0 && particle[1] < Math.min(line[1], line[3])) return (null);
  var particleEquation = interactionHelperFunctions.getEquationOf(...particle);
  var lineEquation = interactionHelperFunctions.lineEquation(...line);

  var ix; {

    var a = particleEquation[0] - lineEquation[0],
      b = particleEquation[1] - lineEquation[1],
      c = particleEquation[2] - lineEquation[2],
      discrim = Math.sqrt(b * b - 4 * a * c);
    var ixs1 = (-b - discrim) / (2 * a);
    var ixs2 = (-b + discrim) / (2 * a);

    var ix1 = interactionHelperFunctions.testVal(ixs1, particle, line);
    var ix2 = interactionHelperFunctions.testVal(ixs2, particle, line);

    if (ix1 === -1 && ix2 === -1) {
      return (null);
    } else if (ix1 === -1) {
      ix = (ixs2);
    } else if (ix2 === -1) {
      ix = (ixs1);
    } else if (ix1 > ix2) {
      ix = (ixs2);
    } else {
      ix = (ixs1);
    }
  }
  //console.log(ix);
  //console.log(particle[0]);

  if (justTime) return ((ix - particle[0]) / particle[2]);
  var iy = interactionHelperFunctions.evalQuad(ix, ...particleEquation);

  var slopeParticle = interactionHelperFunctions.getSlopeAt(ix, ...particleEquation);

  var slopeLine = interactionHelperFunctions.getSlopeAt(ix, ...lineEquation);
  //console.log(slopeParticle);

  var degOfLine = Math.atan2(line[3] - line[1], line[2] - line[0]);

  var degOfParticle = particle[2] < 0 ? Math.atan2(-slopeParticle, -1) : Math.atan2(slopeParticle, 1);
  //error(20,slopeLine*20)

  var force = Math.abs(particle[2]) * Math.sqrt(1 + slopeParticle * slopeParticle);

  //console.log("x:" + Math.cos(degOfParticle) * force + "\ny:" + Math.sin(degOfParticle) * force);

  //error(Math.cos(degOfParticle) * force, Math.sin(degOfParticle) * force);


  degOfParticle -= degOfLine;
  var relativeX = Math.cos(degOfParticle) * force,
    relativeY = Math.sin(degOfParticle) * force;

  //  error(relativeX*20,relativeY*20)

  relativeX *= -.9;
  relativeY *= .1;
  if (relativeY > 0) {
    relativeY++;
  } else {
    relativeY--;
  }

  relativeX *= -1;
  relativeY *= -1;



  var newDegree = Math.atan2(relativeY, relativeX);
  var newForce = Math.hypot(relativeX, relativeY);


  //error(Math.cos(newDegree)*20,Math.sin(newDegree)*20)


  newDegree += degOfLine;
  var nnx = Math.cos(newDegree) * (newForce),
    nny = Math.sin(newDegree) * (newForce);
  //  error(nnx*20,nny*20)

  //console.log("x:" + ix + "\ny:" + iy + "\nxv:" + nnx + "\nyv:" + nny);

  return ([ix, iy, nnx, nny]);

}
var interactionHelperFunctions = {
  getLocationAt: function(n, sx, sy, sxv, syv) {
    return ([sx + n * sxv, -(n * n) + syv * n + sy]);
  },

  getEquationOf: function(sx, sy, sxv, syv) {
    return ([(-1 / (sxv * sxv)), 2 * sx / (sxv * sxv) + syv / sxv, sy - (sx * sx) / (sxv * sxv) - sx * syv / sxv]);
  },

  getSlopeAt: function(x, a, b, c) {
    return (2 * a * x + b);
  },

  evalQuad: function(x, a, b, c) {
    return (x * x * a + x * b + c);
  },


  lineEquation: function(x1, y1, x2, y2) {
    var slope = (y2 - y1) / (x2 - x1);
    return ([0, slope, y1 - slope * x1])
  },
  drawLine: function(ctx, sx, sy, sxv, syv) {

    var eq = this.getEquationOf(sx, sy, sxv, syv);
    ctx.beginPath();
    for (var x = -500; x < 500; x += 1) {
      if (sxv > 0 ? x > sx : x < sx)
        ctx.lineTo(x, this.evalQuad(x, ...eq));
    }
    ctx.stroke();
    for (var n = 0; n < 100; n += 1) {
      ctx.beginPath();
      ctx.arc(sx + n * sxv, -(n * n) + syv * n + sy, 3, 0, 2 * Math.PI, true);
      ctx.fill();
    }
  },
  testVal: function(ix, particle, line) {

    if (isNaN(ix)) return (-1); //doesn't exist
    if (ix > line[2] || ix < line[0]) return (-1); //not in line
    var tim = (ix - particle[0]) / particle[2];

    if (tim <= .001) return (-1); //in past
    return (tim);
  }
}

function error(x, y) {
  var canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  canvas.style.border = "1px solid red";
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(50 + x, 50 + y * -1);
  ctx.stroke();

}

function newCtx() {
  var canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  ctx.strokeRect(0, 0, 500, 500);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;


  ctx.translate(250, 250);
  ctx.scale(1, -1);
  return (ctx);
}
