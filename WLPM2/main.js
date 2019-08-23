window.onload = function() {
  var frame=0;
  window.setInterval(function(){
    document.getElementById("fps").innerHTML=frame;
    frame=0;
  },1000);
  function step(mode,alternateInput) {
    frame++;
    var computePositionIn=alternateInput?alternateInput[0]:document.getElementById("computePosition"+(mode?"A":"B"));
    var computeVelocityIn=alternateInput?alternateInput[1]:document.getElementById("computeVelocity"+(mode?"A":"B"));

    var computePositionOut=document.getElementById("computePosition"+(mode?"B":"A"));
    var computeVelocityOut=document.getElementById("computeVelocity"+(mode?"B":"A"));
    var p0= performance.now();

    for(var i=0;i<2;i++){
      WGPM.webGlShaderRender([computePositionIn,computeVelocityIn],[computePositionOut,computeVelocityOut][i],
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
        uniform sampler2D u_image1;

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
          vec4 PosData=vec4(texture2D(u_image0, vec2(0,v_texCoord.y)).rg,texture2D(u_image0, vec2(1,v_texCoord.y)).rg);
          vec4 VolData=vec4(texture2D(u_image1, vec2(0,v_texCoord.y)).rg,texture2D(u_image1, vec2(1,v_texCoord.y)).rg);
          vec2 pos=vec2(bytesToInt(PosData.rg),bytesToInt(PosData.ba));
          vec2 vol=vec2(bytesToInt(VolData.rg),bytesToInt(VolData.ba));
          vol-=32768.0;
          ${!i?
          `
          pos+=vol;

          `
          :
          `
          vol.y-=10.0;
          `
          }

          vol+=32768.0;

          PosData=vec4(intToBytes(pos.r),intToBytes(pos.g));
          VolData=vec4(intToBytes(vol.r),intToBytes(vol.g));

          vec4 thisData=${i?"VolData":"PosData"};
          if(v_texCoord.x<.5){
            gl_FragColor=vec4(thisData.rg,0,1);
          }else{
            gl_FragColor=vec4(thisData.ba,0,1);
          }
        }
        `,
        false
    );
    }
    var p1= performance.now();

    //first column is x, second is y
    var pixelArrays=[];
    for(var i=0;i<2;i++){
      var thisCanvas=[computePositionOut,computeVelocityOut][i];
      var gl=thisCanvas.getContext("webgl");
      var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
      gl.flush();
      gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      pixelArrays.push(Array.from(pixels));

    }
    var p2= performance.now();

    function bytesToFloat(a,b){
      return(((a<<8)+b)/(2<<15));
    }
    var result=Array(2*2*computePositionOut.height);
    for (var i = 0; i < result.length; i+=4) {
      result[i]=bytesToFloat(pixelArrays[0][(i/2)*4],pixelArrays[0][(i/2)*4+1]);
      result[i+1]=bytesToFloat(pixelArrays[0][(i/2+1)*4],pixelArrays[0][(i/2+1)*4+1]);
      result[i+2]=bytesToFloat(pixelArrays[1][(i/2)*4],pixelArrays[1][(i/2)*4+1]);
      result[i+3]=bytesToFloat(pixelArrays[1][(i/2+1)*4],pixelArrays[1][(i/2+1)*4+1]);
    }

    for(var i=0;i < result.length; i+=4){
      result[i+2]=result[i]-(result[i+2]-.5);
      result[i+3]=result[i+1]-(result[i+3]-.5);

    }
    var p3= performance.now();


    WGPM.webGlPixelRender(
      result,
      document.getElementById("render"));
    window.setTimeout(function(){
      step(!mode);
    },0);


    var p4= performance.now();


    var total=p4-p0;
    document.getElementById("computationd").innerHTML=((p1-p0)/total*100).toFixed(0);
    document.getElementById("arraysd").innerHTML=((p2-p1)/total*100).toFixed(0);
    document.getElementById("conversiond").innerHTML=((p3-p2)/total*100).toFixed(0);
    document.getElementById("renderd").innerHTML=((p4-p3)/total*100).toFixed(0);


  }
  step(false,[document.getElementById("inputPosition"),document.getElementById("inputVelocity")]);
}
