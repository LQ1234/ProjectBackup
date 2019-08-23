window.onload = function() {
  var noOfParticles = 10000;
  var sqrtNum=Math.floor(Math.sqrt(noOfParticles));
  document.getElementById("particles").innerHTML = noOfParticles;

  Array.prototype.forEach.call(document.getElementById("canvases").children, function(a) {
    if (a.id != "render"&&a.id != "renderzoomed") {
      a.width = 2*sqrtNum, a.height =sqrtNum;
    }
  });
  console.log(2*Math.floor(Math.sqrt(noOfParticles)),Math.floor( Math.sqrt(noOfParticles)));
  var cbrtNum=Math.floor(Math.cbrt(sqrtNum*sqrtNum));
  var arrayData=[];
  Math.seedrandom('any string you like');

  for(var i=0;i<cbrtNum*4;i++){
    var xa=.5+(Math.random()-.5)*.85;
    var ya=.5+(Math.random()-.5)*.85;
    for(var j=0;j<cbrtNum/2;j++){
      var xb=xa+(Math.random()-.5)*.15;
      var yb=ya+(Math.random()-.5)*.15;
      for(var k=0;k<cbrtNum/2;k++){
        var xc=xb+(Math.random()-.5)*.05;
        var yc=yb+(Math.random()-.5)*.05;
        arrayData.push(...[xc,yc,0,0]);

      }
    }
  }
  while(arrayData.length>sqrtNum*sqrtNum*4){
    arrayData.pop();
  }
  console.log(sqrtNum*sqrtNum*4);
  while(arrayData.length<sqrtNum*sqrtNum*4){
    var randInx=Math.floor(Math.random()*arrayData.length/4)*4;
    arrayData.push(...[arrayData[randInx],arrayData[randInx+1],0,0]);

  }
  console.log(arrayData.length);


  WGPM.renderData(arrayData,document.getElementById("computeA"));
  /*
  WGPM.webGlShaderRender([], document.getElementById("color"),
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


      uniform vec2 u_textureSize;
      varying vec2 v_texCoord;


      void main() {
        const float PI = 3.1415926535897932384626433832795;
        float cst=v_texCoord.x*PI*2.0;
        gl_FragColor=vec4(vec3(cos(cst)/2.0+.5,cos(cst+PI/2.0*3.0)/2.0+.5,cos(cst+PI/4.0*3.0)/2.0+.5)*(v_texCoord.y+.5)*3.0*vec3(.2,.5,1.0),.5);
        //gl_FragColor=vec4(1,1,1,.5)p;
      }

      `,
    false
  );

  */

  var ticknum=0;

  var frame = 0;
  window.setInterval(function() {
    document.getElementById("fps").innerHTML = frame;
    frame = 0;
  }, 1000);

  function step(mode, alternateInput) {
    console.log(ticknum);
    ticknum++;
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

            pos+=vol/150.0;
            posData=vec4(intToBytes(pos.r),intToBytes(pos.g));
            gl_FragColor=posData;


          }else{//velocity
            vec4 posData=texture2D(u_image0, vec2(v_texCoord.x-1.0/u_textureSize.x,v_texCoord.y));
            vec4 volData=texture2D(u_image0, v_texCoord);
            vec2 pos=vec2(bytesToInt(posData.rg),bytesToInt(posData.ba));
            vec2 vol=vec2(bytesToInt(volData.rg),bytesToInt(volData.ba))-32768.0;
            for(float y=0.0;y<1.0;y+=${1/ysize}){
              for(float x=0.0;x<1.0;x+=${2/xsize}){
                vec4 otherPosData=texture2D(u_image0, vec2(x,y));
                vec2 otherPos=vec2(bytesToInt(otherPosData.rg),bytesToInt(otherPosData.ba));
                otherPos-=pos;
                float angle=atan(otherPos.y,otherPos.x);
                float dist=distance(vec2(0,0),otherPos);
                if(dist>0.0){
                  vol+=vec2(cos(angle),sin(angle))*min(1.0/dist/dist,.000000001*25.0)*30000000.0;

                }
              }
            }

            volData=vec4(intToBytes(vol.r+32768.0),intToBytes(vol.g+32768.0));
            gl_FragColor=volData;

          }
        }

        `,
      false
    );

    var render=document.getElementById("render");
    WGPM.renderCanvas(computeOut,document.getElementById("color"),  render);

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

    if(ticknum<216){
      window.requestAnimationFrame(function() {
        step(!mode);
      });
    }else{
      //WGPM.copyPixelToParticles(computeOut,document.getElementById("grassImg"),  document.getElementById("color"));
      //WGPM.renderCanvas(computeOut,document.getElementById("color"),  document.getElementById("render"));

    }





  }
  step(true);
}
