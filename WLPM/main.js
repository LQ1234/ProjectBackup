window.onload=function(){
  var mx=150,my=150,tt=0;

  function frameRate(){
    document.getElementById("fps").innerHTML=framecount;
    framecount=0;
  }
  var canvas=document.getElementById("canout");
  canvas.onmousemove = function(evt) {
    var rect = canvas.getBoundingClientRect();
    mx= evt.clientX - rect.left,
    my= evt.clientY - rect.top

  }
  window.setInterval(frameRate,1000);
  var framecount=0;
  frame();
  function frame(){
    framecount++;
    tt+=.01;

    WGPM(document.getElementById("canin"))
    .noiseColor({r:0,g:.5,b:1},0,tt,30,.01,.01,mx+tt,my)

    .noiseWave(0,tt,30,.01,.01,mx+tt,my)
    .finish(document.getElementById("canout"),
      function(canvas){
        window.setTimeout(frame,1);
      }
    );
  }
}
