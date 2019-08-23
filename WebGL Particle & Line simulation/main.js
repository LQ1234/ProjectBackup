window.onload = function() {

  var noOfParticles = 100000;
  var sqrtNum=Math.floor(Math.sqrt(noOfParticles));
  document.getElementById("particles").innerHTML = noOfParticles;

  Array.prototype.forEach.call(document.getElementById("canvases").children, function(a) {
    if (a.id != "render"&&a.id != "particleInteractions") {
      a.width = 2*sqrtNum, a.height =sqrtNum;
    }
  });
  console.log(2*Math.floor(Math.sqrt(noOfParticles)),Math.floor( Math.sqrt(noOfParticles)));
  var arrayData=[];

  for (var x = 0; x < 1; x+=(1/sqrtNum)) {
    for (var y = 0; y < 1; y+=(1/sqrtNum)) {
      //arrayData.push(...[(Math.random()-.5)*.7+.5,1,(Math.random()-.5)*.005,(Math.random()-.5)*.005]);
      //arrayData.push(...[.2,.2,(Math.random()-.5+1)*.005,(Math.random()-.5+1)*.005]);
      //arrayData.push(...[(Math.random()-.5)*.7+.5,.3,(Math.random()-.5)*.005,(Math.random()-.5)*.005]);
      arrayData.push(...[(Math.random()-.5)*.015+.09,(Math.random()-.5)*.005+.9,(Math.random()-.5)*.015,(Math.random()-.5)*.015-.02]);

    }
  }
  while(arrayData.length>4*sqrtNum*sqrtNum){
    arrayData.pop();
  }
  WGPM.renderData(arrayData,document.getElementById("computeA"));
  var lineCanvas=document.getElementById("lineData");
  var lines=[.8,.5,.2,.5,
             /*.5,.2,.5,.8,
             .2,.2,.8,.8,
             .2,.8,.8,.2*/];
  /*for (var i = 0; i < 100; i++) {
    lines.push(...[Math.random(),Math.random(),Math.random(),Math.random()]);
  }*/
  //lines=[20, 500, 0, 200, 500, 200, 480, 500, 480, 500, 20, 500, 0, 200, 500, 200];
  //lines=[0, 60, 220, 140, 500, 60, 280, 140, 160, 180, 280, 240, 360, 240, 240, 300, 160, 300, 280, 360, 260, 380, 300, 440, 300, 440, 380, 440, 380, 440, 420, 380];
  //lines=[20, 120, 40, 200, 40, 200, 60, 260, 60, 260, 80, 300, 80, 300, 100, 320, 100, 320, 140, 340, 140, 340, 200, 360, 200, 360, 260, 360, 260, 360, 320, 340, 320, 340, 360, 300];
  lines=[20, 80, 30, 150, 30, 150, 40, 210, 40, 210, 50, 250, 50, 250, 60, 280, 60, 280, 70, 290, 70, 290, 90, 300, 90, 300, 120, 300, 120, 300, 140, 290, 140, 290, 150, 270, 210, 230, 200, 250, 210, 230, 220, 250, 200, 250, 220, 250, 260, 250, 280, 250, 270, 230, 260, 250, 270, 230, 280, 250, 230, 220, 250, 220, 240, 200, 230, 220, 240, 200, 250, 220, 320, 250, 340, 250, 380, 250, 400, 250, 230, 280, 250, 280, 290, 280, 310, 280, 350, 280, 370, 280, 240, 260, 230, 280, 240, 260, 250, 280, 300, 260, 290, 280, 300, 260, 310, 280, 330, 230, 320, 250, 330, 230, 340, 250, 360, 260, 350, 280, 360, 260, 370, 280, 390, 230, 380, 250, 390, 230, 400, 250, 290, 220, 310, 220, 300, 200, 290, 220, 300, 200, 310, 220, 350, 220, 370, 220, 360, 200, 350, 220, 360, 200, 370, 220, 180, 260, 170, 280, 180, 260, 190, 280, 170, 280, 190, 280, 270, 170, 260, 190, 270, 170, 280, 190, 260, 190, 280, 190, 420, 260, 410, 280, 420, 260, 430, 280, 410, 280, 430, 280, 330, 170, 320, 190, 330, 170, 340, 190, 240, 140, 230, 160, 240, 140, 250, 160, 210, 170, 200, 190, 210, 170, 220, 190, 180, 200, 170, 220, 180, 200, 190, 220, 180, 140, 170, 160, 180, 140, 190, 160, 210, 110, 200, 130, 210, 110, 220, 130, 420, 200, 410, 220, 420, 200, 430, 220, 390, 170, 380, 190, 390, 170, 400, 190, 380, 190, 400, 190, 360, 140, 350, 160, 360, 140, 370, 160, 350, 160, 370, 160, 420, 140, 410, 160, 420, 140, 430, 160, 410, 160, 430, 160, 280, 130, 260, 130, 320, 130, 340, 130, 380, 130, 400, 130, 270, 110, 260, 130, 270, 110, 280, 130, 330, 110, 320, 130, 330, 110, 340, 130, 390, 110, 380, 130, 390, 110, 400, 130, 170, 100, 190, 100, 180, 80, 170, 100, 180, 80, 190, 100, 240, 80, 230, 100, 240, 80, 250, 100, 230, 100, 250, 100, 300, 80, 290, 100, 300, 80, 310, 100, 290, 100, 310, 100, 360, 80, 350, 100, 360, 80, 370, 100, 350, 100, 370, 100, 420, 80, 410, 100, 420, 80, 430, 100, 410, 100, 430, 100, 320, 190, 340, 190, 170, 220, 190, 220, 300, 140, 290, 160, 300, 140, 310, 160, 290, 160, 310, 160, 410, 220, 430, 220, 200, 190, 220, 190, 170, 160, 190, 160, 200, 130, 220, 130, 230, 160, 250, 160];
      for (var i = 0; i < lines.length; i++) {
    lines[i]/=500;
    if(i%2==1)lines[i]=1-lines[i];
  }

   document.getElementById("render").onmousemove=function(evt){
     var rect = this.getBoundingClientRect();

     var mousepos={
       x: evt.clientX - rect.left,
       y: evt.clientY - rect.top
     };
     return;
     mousepos.x/=600;
     mousepos.y/=600;
     lines[0]=mousepos.x;
     lines[1]=1-mousepos.y;
     lines[2]=1-mousepos.x;
     lines[3]=mousepos.y;
     console.log(lines);
   }
  lineCanvas.width=2;
  lineCanvas.height=lines.length/4;
  /*
  var thisCanvas = lineCanvas;
  var gl = thisCanvas.getContext("webgl");
  var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.flush();
  gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  console.log(Array.from(pixels));
  */
  var frame = 0;
  window.setInterval(function() {
    document.getElementById("fps").innerHTML = frame;
    frame = 0;
  }, 1000);
  var renderCanvas= document.getElementById("render");


  function step(mode, alternateInput) {

    frame++;
    WGPM.renderLineData(lines,lineCanvas);

    var computeIn = document.getElementById("compute" + (mode ? "A" : "B"));
    var computeOut = document.getElementById("compute" + (mode ? "B" : "A"));

    var xsize=computeIn.width;
    var ysize=computeIn.height;


    WGPM.webGlShaderRender([computeIn,lineCanvas], computeOut,
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
        uniform sampler2D u_image2;

        uniform vec2 u_textureSize0;
        uniform vec2 u_textureSize1;
        uniform vec2 u_textureSize2;

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
        vec3 lineintersection(vec4 linea,vec4 lineb){
          if(linea.x==linea.z&&lineb.x==lineb.z){
            return(vec3(0.0,0.0,0.0));
          }
          if(linea.x==linea.z){
            float slopeb=(lineb.y-lineb.w)/(lineb.x-lineb.z);
            float ceptb=lineb.y-lineb.x*slopeb;
            float isecty=slopeb*linea.x+ceptb;
            if(min(linea.y,linea.w)<=isecty&&isecty<=max(linea.y,linea.w)&&min(lineb.x,lineb.z)<=linea.x&&linea.x<=max(lineb.x,lineb.z)){
              return(vec3(linea.x,isecty,1.0));
            }
            return(vec3(linea.x,isecty,0.0));
          }
          if(lineb.x==lineb.z){
            float slopea=(linea.y-linea.w)/(linea.x-linea.z);
            float cepta=linea.y-linea.x*slopea;
            float isecty=slopea*lineb.x+cepta;
            if(min(lineb.y,lineb.w)<=isecty&&isecty<=max(lineb.y,lineb.w)&&min(linea.x,linea.z)<=lineb.x&&lineb.x<=max(linea.x,linea.z)){
              return(vec3(lineb.x,isecty,1.0));
            }
            return(vec3(lineb.x,isecty,0.0));
          }
          float slopea=(linea.y-linea.w)/(linea.x-linea.z);
          float cepta=linea.y-linea.x*slopea;
          float slopeb=(lineb.y-lineb.w)/(lineb.x-lineb.z);
          float ceptb=lineb.y-lineb.x*slopeb;

          float discrim=-slopea+slopeb;
          float xnum=cepta-ceptb;
          float ynum=-slopea*ceptb+slopeb*cepta;
          xnum/=discrim;
          ynum/=discrim;
          if(min(linea.x,linea.z)<=xnum&&xnum<=max(linea.x,linea.z)&&min(lineb.x,lineb.z)<=xnum&&xnum<=max(lineb.x,lineb.z)){
            return(vec3(xnum,ynum,1));
          }
          return(vec3(0,0,0));
        }
        float random(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }
        void main() {

          if(mod(floor(v_texCoord.x*u_textureSize0.x),2.0)==0.0){//position

            vec4 posData=texture2D(u_image0, v_texCoord);
            vec4 volData=texture2D(u_image0, vec2(v_texCoord.x+1.0/u_textureSize0.x,v_texCoord.y));
            vec2 pos=vec2(bytesToInt(posData.rg),bytesToInt(posData.ba));
            vec2 vol=vec2(bytesToInt(volData.rg),bytesToInt(volData.ba))-32768.0;
            vec2 startPos =pos;
            pos+=vol;
            vec2 endPos =pos;

            /*
            for(int i=0;i<${lineCanvas.height};i++){
              vec4 startLineData=texture2D(u_image1, vec2(0.0,float(i)/u_textureSize1.y));
              vec4 endLineData=texture2D(u_image1, vec2(1.0,float(i)/u_textureSize1.y));
              vec2 startLine=vec2(bytesToInt(startLineData.rg),bytesToInt(startLineData.ba));
              vec2 endLine=vec2(bytesToInt(endLineData.rg),bytesToInt(endLineData.ba));
              vec3 isect=lineintersection(vec4(startPos,endPos),vec4(startLine,endLine));
              if(isect.z>.5){
                pos=isect.xy;
                break;
              }
            }*/
            posData=vec4(intToBytes(pos.r),intToBytes(pos.g));
            gl_FragColor=posData;


          }else{//velocity
            vec4 posData=texture2D(u_image0, vec2(v_texCoord.x-1.0/u_textureSize0.x,v_texCoord.y));
            vec4 volData=texture2D(u_image0, v_texCoord);
            vec2 pos=vec2(bytesToInt(posData.rg),bytesToInt(posData.ba));
            vec2 vol=vec2(bytesToInt(volData.rg),bytesToInt(volData.ba))-32768.0;
            vol.y-=15.0;




            vol*=.9999;
            vec2 startPos =pos;
            vec2 endPos =pos+vol+vol;
            for(int k=0;k<10;k++){// why redo? it is because the particles freaking glitch thru if they collide with two lines at once. MAKE NOTE!!
              bool redo=false;
              for(int i=0;i<${lineCanvas.height};i++){
                vec4 startLineData=texture2D(u_image1, vec2(0.0,float(i)/u_textureSize1.y));
                vec4 endLineData=texture2D(u_image1, vec2(1.0,float(i)/u_textureSize1.y));
                vec2 startLine=vec2(bytesToInt(startLineData.rg),bytesToInt(startLineData.ba));
                vec2 endLine=vec2(bytesToInt(endLineData.rg),bytesToInt(endLineData.ba));
                vec3 isect=lineintersection(vec4(startPos,endPos),vec4(startLine,endLine));
                if(isect.z>.5){
                  redo=true;
                  /*
                  float lineAngle=atan((startLine.y-endLine.y),(startLine.x-endLine.x));
                  float particleAngle=atan(endPos.y-startPos.y,endPos.x-startPos.x);
                  float particleLength=distance(endPos,startPos)/2.0;
                  particleAngle-=lineAngle;
                  vec2 particleVector=vec2(cos(particleAngle),sin(particleAngle))*particleLength;
                  particleVector*=-1.0;
                  particleVector.x*=-0.96;
                  particleVector.y*=0.0;

                  particleAngle=atan(particleVector.y,particleVector.x);
                  particleAngle+=lineAngle;
                  particleLength=length(particleVector);
                  //particleLength+=1.0;
                  vec2 startvol=vol;
                  vol=vec2(cos(particleAngle),sin(particleAngle))*particleLength;*/


                  vec2 reflectionVec=vec2(0,0);
                  if(startLine.x==endLine.x){
                    reflectionVec.x=1.0;
                  }else if(startLine.y==endLine.y){
                    reflectionVec.y=1.0;
                  }else{
                    float slope=(startLine.y-endLine.y)/(startLine.x-endLine.x);
                    reflectionVec.x=1.0;
                    reflectionVec.y=-1.0/slope;

                  }

                  vec2 startvol=vol;

                  vec2 reflection=reflect(startvol,normalize(reflectionVec));
                  vec2 opposideLineVec=(-startvol+reflection)/2.0;
                  vol=reflection;
                  vol-=opposideLineVec;
                  vol+=normalize(opposideLineVec)*15.0;
                 startPos =startPos+vol;
                 endPos =startPos+vol+vol;
                }
              }
              if(!redo)break;
            }
            volData=vec4(intToBytes(vol.r+32768.0),intToBytes(vol.g+32768.0));
            gl_FragColor=volData;

          }
        }

        `,
      false
    );


    WGPM.renderCanvas(computeIn, renderCanvas);


    WGPM.renderLineCanvas(lineCanvas,  document.getElementById("render"));





    window.requestAnimationFrame(function() {
      step(!mode);
    });






  }
  step(true);
}
