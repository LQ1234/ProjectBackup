window.onload = function() {
  var noOfParticles = 10000;
  var sqrtNum=Math.floor(Math.sqrt(noOfParticles));
  document.getElementById("particles").innerHTML = noOfParticles;

  Array.prototype.forEach.call(document.getElementById("canvases").children, function(a) {
    if (a.id != "render") {
      a.width = 2*sqrtNum, a.height =sqrtNum;
    }
  });
  console.log(2*Math.floor(Math.sqrt(noOfParticles)),Math.floor( Math.sqrt(noOfParticles)));
  var arrayData=[];
  /*
  for (var x = 0; x < 1; x+=(1/sqrtNum)) {
    for (var y = 0; y < 1; y+=(1/sqrtNum)) {
      arrayData.push(...[x,y,0,0]);

    }
  }*/

  for(var i=0;i<sqrtNum;i++){
    var startx=.5+(Math.random()-.5)*.8;
    var starty=.5+(Math.random()-.5)*.8;

    for(var j=0;j<sqrtNum;j++){
      arrayData.push(...[startx+(Math.random()-.5)*.08,starty+(Math.random()-.5)*.08,(Math.random()-.5)*.001,(Math.random()-.5)*.001]);
    }
  }
  WGPM.renderData(arrayData,document.getElementById("computeA"));






  var frame = 0;
  window.setInterval(function() {
    document.getElementById("fps").innerHTML = frame;
    frame = 0;
  }, 1000);

  function step(mode, alternateInput) {

    frame++;

    var computeIn = document.getElementById("compute" + (mode ? "A" : "B"));
    var computeOut = document.getElementById("compute" + (mode ? "B" : "A"));

    var xsize=computeIn.width;
    var ysize=computeIn.height;

    WGPM.webGlShaderRender([computeIn], computeOut,
      `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = vec4(a_position, 0, 1);
          v_texCoord = a_texCoord;
        }
        `,
      `
        precision highp float;

        uniform sampler2D u_image0;

        uniform vec2 u_textureSize;
        varying vec2 v_texCoord;

        float bytesToInt(vec2 n){
          vec2 pro=floor(n*255.0);
          return(pro.r*256.0+pro.g);
        }
        vec2 intToBytes(float n){
          float a=floor(n/256.0);
          float b=mod(n,256.0);

          return(vec2(a,b)/255.0);
        }
        void main() {

          if(mod(floor(v_texCoord.x*u_textureSize.x),2.0)==0.0){//position

            vec4 posData=texture2D(u_image0, v_texCoord);
            vec4 volData=texture2D(u_image0, vec2(v_texCoord.x+1.0/u_textureSize.x,v_texCoord.y));
            vec2 pos=vec2(bytesToInt(posData.rg),bytesToInt(posData.ba));
            vec2 vol=vec2(bytesToInt(volData.rg),bytesToInt(volData.ba))-32768.0;

            pos+=vol;

            posData=vec4(intToBytes(pos.r),intToBytes(pos.g));
            gl_FragColor=posData;


          }else{//velocity
            vec4 posData=texture2D(u_image0, vec2(v_texCoord.x-1.0/u_textureSize.x,v_texCoord.y));
            vec4 volData=texture2D(u_image0, v_texCoord);
            vec2 pos=vec2(bytesToInt(posData.rg),bytesToInt(posData.ba));
            vec2 vol=vec2(bytesToInt(volData.rg),bytesToInt(volData.ba))-32768.0;
            vec2 newvol=vec2(0,0);
            for(float y=0.0;y<=1.0;y+=${1/ysize}){
              for(float x=0.0;x<=1.0;x+=${2/xsize}){
                vec4 otherPosData=texture2D(u_image0, vec2(x,y));
                vec2 otherPos=vec2(bytesToInt(otherPosData.rg),bytesToInt(otherPosData.ba));
                otherPos-=pos;
                float angle=atan(otherPos.y,otherPos.x);
                float dist=distance(vec2(0,0),otherPos);
                if(dist>0.0){
                  newvol+=vec2(cos(angle),sin(angle))*max(.000000005,min(.000000015,1.0/dist/dist))*100000.0;

                }
              }
            }
            vol+=newvol;
            volData=vec4(intToBytes(vol.r+32768.0),intToBytes(vol.g+32768.0));
            gl_FragColor=volData;

          }
        }

        `,
      false
    );


    WGPM.renderCanvas(computeIn,  document.getElementById("render"));

    //WGPM.webGlPixelRender([.5,.5,.5,.5], document.getElementById("render"));
    /*
    var pixelArrays = [];
    for (var i = 0; i < 2; i++) {
      var thisCanvas = [computePositionOut, computeVelocityOut][i];
      var gl = thisCanvas.getContext("webgl");
      var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
      gl.flush();
      gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      pixelArrays.push(Array.from(pixels));

    }

    function bytesToFloat(a, b) {
      return (((a << 8) + b) / (2 << 15));
    }
    var result = Array(2 * 2 * computePositionOut.height);
    for (var i = 0; i < result.length; i += 4) {
      result[i] = bytesToFloat(pixelArrays[0][(i / 2) * 4], pixelArrays[0][(i / 2) * 4 + 1]);
      result[i + 1] = bytesToFloat(pixelArrays[0][(i / 2 + 1) * 4], pixelArrays[0][(i / 2 + 1) * 4 + 1]);
      result[i + 2] = bytesToFloat(pixelArrays[1][(i / 2) * 4], pixelArrays[1][(i / 2) * 4 + 1]);
      result[i + 3] = bytesToFloat(pixelArrays[1][(i / 2 + 1) * 4], pixelArrays[1][(i / 2 + 1) * 4 + 1]);
    }

    for (var i = 0; i < result.length; i += 4) {
      result[i + 2] = result[i] - (result[i + 2] - .5);
      result[i + 3] = result[i + 1] - (result[i + 3] - .5);

    }
    */


    window.requestAnimationFrame(function() {
      step(!mode);
    });






  }
  step(true);
}
