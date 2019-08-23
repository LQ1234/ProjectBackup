
var WGPM=(function(){
  function webGlPixelRender(pixelArray, outputCanvas) {
    var vertexShaderScript=`
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position*2.0-1.0, 0, 1);
    }
    `;
    var fragmentShaderScript=`
    precision mediump float;

    void main() {
      gl_FragColor = vec4(0,0,0,1);
    }
    `;
    var gl = outputCanvas.getContext("webgl");

    var program = createProgram(gl, vertexShaderScript, fragmentShaderScript);
    gl.useProgram(program);
    var locations = {
      position: gl.getAttribLocation(program, "a_position") //location of vertex of objects (for vertex shader)
    }

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pixelArray), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);


    gl.viewport(0, 0, outputCanvas.width, outputCanvas.height);

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var primitiveType =gl.POINTS;
    var offset = 0;
    var count = pixelArray.length/2;
    gl.drawArrays(primitiveType, offset, count);
  }


  function webGlShaderRender(inputCanvases, outputCanvas, vertexShaderScript, fragmentShaderScript,premultiply) {
    var gl = outputCanvas.getContext("webgl",{
      premultipliedAlpha: premultiply===undefined?true:premultiply,  //no premultiply
      antialias: false
    });
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, false);
    var program = createProgram(gl, vertexShaderScript, fragmentShaderScript);
    gl.useProgram(program);
    var locations = {
      position: gl.getAttribLocation(program, "a_position"), //location of vertex of objects (for vertex shader)
      texcoord: gl.getAttribLocation(program, "a_texCoord"), //location of textures in objects (for vertex shader)
      textureSize: gl.getUniformLocation(program, "u_textureSize"), //size of texture (for fragment shader)
      textures: Array(inputCanvases.length).fill("u_image").map((a, b) => {
        return a + b
      }).map((a) => {
        return gl.getUniformLocation(program, a)
      }) //textures to load (for fragment shader)
    }
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setBufferToRect(gl, -1, 1, 1, -1); //this is the location of vertexes (the y values are switched because of webgl's weird coordinate system)
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);

    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    setBufferToRect(gl, 0, 0, 1, 1); //this is the location of textures on objects (webgl's coordinate system for images go from 0 to 1)
    gl.enableVertexAttribArray(locations.texcoord);
    gl.vertexAttribPointer(locations.texcoord, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(locations.textureSize, outputCanvas.width, outputCanvas.height); //set texture size
    var textures=[];
    for (var i = 0; i < inputCanvases.length; i++) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inputCanvases[i]);
      textures.push(texture);
    }
    for (var i = 0; i < inputCanvases.length; i++) {
      gl.uniform1i(locations.textures[i], i);
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    }

    gl.viewport(0, 0, outputCanvas.width, outputCanvas.height);



    gl.clearColor(0.0, 0.5, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
  //dataArrays=[x,y,xv,yv]
  function renderData(/*inputCanvases*/dataArrays, outputCanvas/*, vertexShaderScript, fragmentShaderScript,premultiply*/) {
    var vertexShaderScript=`
    attribute vec2 pixelLoc;
    attribute vec2 pixelData;
    varying vec4 toPassData;
    uniform vec2 u_textureSize;


    vec2 intToBytes(float n){
      float a=floor(n/256.0);
      float b=mod(n,256.0);

      return(vec2(a,b)/255.0);
    }

    void main() {

      gl_Position = vec4((pixelLoc+.5)/(u_textureSize)*2.0-1.0, 0, 1);
      if(mod(pixelLoc.x,2.0)==0.0){
        toPassData = vec4(intToBytes(pixelData.x*65536.0),intToBytes(pixelData.y*65536.0));
      }else{
        toPassData = vec4(intToBytes((pixelData.x+.5)*65536.0),intToBytes((pixelData.y+.5)*65536.0));
      }
    }
    `;
    var fragmentShaderScript=`
    precision highp float;

    varying vec4 toPassData;

    void main() {
      gl_FragColor=toPassData;
    }
    `;
    if(outputCanvas.width*outputCanvas.height!==dataArrays.length/2){
      console.log("error: canvas dimentions "+outputCanvas.width+"x"+outputCanvas.height+" does not match array size: "+dataArrays.length);
      return;
    }

    var gl = outputCanvas.getContext("webgl",{
      premultipliedAlpha: false,  //no premultiply
      antialias: false
    });
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, false);

    var program = createProgram(gl, vertexShaderScript, fragmentShaderScript);
    gl.useProgram(program);

    var locations = {
      pixelLoc: gl.getAttribLocation(program, "pixelLoc"), //location of vertex of objects (for vertex shader)
      pixelData: gl.getAttribLocation(program, "pixelData"), //location of textures in objects (for vertex shader)
      textureSize: gl.getUniformLocation(program, "u_textureSize"), //size of texture (for fragment shader)

    }
    var posArrays=new Array(outputCanvas.width*outputCanvas.height*2).fill(0).map((a,b)=>{return (b%2==0)?Math.floor(b/2)%outputCanvas.width:(outputCanvas.height-1-Math.floor(b/2/outputCanvas.width))});

    var pixelLocBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pixelLocBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posArrays), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations.pixelLoc);
    gl.vertexAttribPointer(locations.pixelLoc, 2, gl.FLOAT, false, 0, 0);

    var pixelDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pixelDataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataArrays), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations.pixelData);
    gl.vertexAttribPointer(locations.pixelData, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(locations.textureSize, outputCanvas.width, outputCanvas.height); //set texture size



    gl.viewport(0, 0, outputCanvas.width, outputCanvas.height);



    gl.clearColor(0.0, 0.5, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var primitiveType = gl.POINTS;
    var offset = 0;
    var count = dataArrays.length/2;
    gl.drawArrays(primitiveType, offset, count);
  }
  function renderCanvas(canvasToRender,colorCanvas, outputCanvas,_zoom) {
    var zoom=_zoom||1;
    var inputCanvases=[canvasToRender,colorCanvas];
    var vertexShaderScript=`

    attribute vec2 pixelLoc;
    uniform vec2 u_textureSize;
    uniform float zoom;

    uniform sampler2D u_image0;
    uniform sampler2D u_image1;

    varying vec4 shaderColor;


    float bytesToInt(vec2 n){
      vec2 pro=floor(n*255.0);
      return(pro.r*256.0+pro.g);
    }

    void main() {
      vec4 colorData = texture2D(u_image0,(pixelLoc)/u_textureSize);
      vec2 posData=vec2(bytesToInt(colorData.rg),bytesToInt(colorData.ba));
      posData/=65536.0;
      posData=posData*2.0-1.0;
      gl_Position =vec4(posData*zoom,0,1);
      shaderColor= texture2D(u_image1,(pixelLoc)/u_textureSize);
    }
    `;
    var fragmentShaderScript=`
    precision highp float;

    varying vec4 shaderColor;

    void main() {
      gl_FragColor=shaderColor;
    }
    `;


    var gl = outputCanvas.getContext("webgl",{
      premultipliedAlpha: false,  //no premultiply
      antialias: true
    });
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, false);

    var program = createProgram(gl, vertexShaderScript, fragmentShaderScript);
    gl.useProgram(program);

    var locations = {
      pixelLoc: gl.getAttribLocation(program, "pixelLoc"), //location of vertex of objects (for vertex shader)
      textureSize: gl.getUniformLocation(program, "u_textureSize"), //size of texture (for fragment shader)
      zoom: gl.getUniformLocation(program, "zoom"),

      textures: Array(inputCanvases.length).fill("u_image").map((a, b) => {
        return a + b
      }).map((a) => {
        return gl.getUniformLocation(program, a)
      })
    }
    if(WGPM.cashe.posArrays&&WGPM.cashe.posArrays.length===canvasToRender.width*canvasToRender.height){
      posArrays=WGPM.cashe.posArrays;
    }else{
      var posArrays=new Array(canvasToRender.width*canvasToRender.height).fill(0).map((a,b)=>{return (b%2==0)?Math.floor(b)%canvasToRender.width:(canvasToRender.height-1-Math.floor(b/canvasToRender.width))});
      WGPM.cashe.posArrays=posArrays;

    }

    var pixelLocBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pixelLocBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posArrays), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations.pixelLoc);
    gl.vertexAttribPointer(locations.pixelLoc, 2, gl.FLOAT, false, 0, 0);


    gl.uniform2f(locations.textureSize, canvasToRender.width, canvasToRender.height); //set texture size
    gl.uniform1f(locations.zoom, zoom); //set texture size

    var textures=[];
    for (var i = 0; i < inputCanvases.length; i++) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inputCanvases[i]);
      textures.push(texture);
    }
    for (var i = 0; i < inputCanvases.length; i++) {
      gl.uniform1i(locations.textures[i], i);
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    }

    gl.viewport(0, 0, outputCanvas.width, outputCanvas.height);



    gl.clearColor(1,1,1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var primitiveType = gl.POINTS;
    var offset = 0;
    var count = posArrays.length/2;
    gl.drawArrays(primitiveType, offset, count);

  }
  function copyPixelToParticles(pixelInformationCanvas,imageCanvas, colorCanvas) {

    var inputCanvases=[pixelInformationCanvas,imageCanvas];
    var vertexShaderScript=`

    attribute vec2 pixelLoc;
    uniform vec2 u_textureSize;
    uniform sampler2D u_image0;
    uniform sampler2D u_image1;

    varying vec4 shaderColor;


    float bytesToInt(vec2 n){
      vec2 pro=floor(n*255.0);
      return(pro.r*256.0+pro.g);
    }

    void main() {
      vec4 colorData = texture2D(u_image0,(pixelLoc)/u_textureSize);
      vec2 posData=vec2(bytesToInt(colorData.rg),bytesToInt(colorData.ba));
      posData/=65536.0;
      posData.y=1.0-posData.y;
      shaderColor= texture2D(u_image1,(posData-vec2(.46,.465))*18.0);
      gl_Position =vec4(((pixelLoc+.5)/u_textureSize*2.0-1.0)*vec2(1,-1),0,1);
    }
    `;
    var fragmentShaderScript=`
    precision highp float;

    varying vec4 shaderColor;

    void main() {
      gl_FragColor=shaderColor;
    }
    `;


    var gl = colorCanvas.getContext("webgl",{
      premultipliedAlpha: false,  //no premultiply
      antialias: true
    });
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, false);

    var program = createProgram(gl, vertexShaderScript, fragmentShaderScript);
    gl.useProgram(program);

    var locations = {
      pixelLoc: gl.getAttribLocation(program, "pixelLoc"), //location of vertex of objects (for vertex shader)
      textureSize: gl.getUniformLocation(program, "u_textureSize"), //size of texture (for fragment shader)
      textures: Array(inputCanvases.length).fill("u_image").map((a, b) => {
        return a + b
      }).map((a) => {
        return gl.getUniformLocation(program, a)
      })
    };
    if(WGPM.cashe.posArrays&&WGPM.cashe.posArrays.length===colorCanvas.width*colorCanvas.height){

      posArrays=WGPM.cashe.posArrays;
    }else{
      var posArrays=new Array(colorCanvas.width*colorCanvas.height).fill(0).map((a,b)=>{return (b%2==0)?Math.floor(b)%colorCanvas.width:(colorCanvas.height-1-Math.floor(b/colorCanvas.width))});
    }

    var pixelLocBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pixelLocBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posArrays), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations.pixelLoc);
    gl.vertexAttribPointer(locations.pixelLoc, 2, gl.FLOAT, false, 0, 0);


    gl.uniform2f(locations.textureSize, colorCanvas.width, colorCanvas.height); //set texture size

    var textures=[];
    for (var i = 0; i < inputCanvases.length; i++) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inputCanvases[i]);
      textures.push(texture);
    }
    for (var i = 0; i < inputCanvases.length; i++) {
      gl.uniform1i(locations.textures[i], i);
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    }

    gl.viewport(0, 0, colorCanvas.width, colorCanvas.height);



    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var primitiveType = gl.POINTS;
    var offset = 0;
    var count = posArrays.length/2;
    gl.drawArrays(primitiveType, offset, count);

  }
  function setBufferToRect(gl, fromx, fromy, tox, toy) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      fromx, fromy,
      tox, fromy,
      fromx, toy,
      tox, fromy,
      fromx, toy,
      tox, toy
    ]), gl.STATIC_DRAW);
  }

  function createProgram(gl, vertexShaderScript, fragmentShaderScript) {
    var program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderScript));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderScript));
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  return({
    cashe:{},
    copyPixelToParticles:copyPixelToParticles,
    renderCanvas:renderCanvas,
    renderData:renderData,
    webGlShaderRender:webGlShaderRender,
    webGlPixelRender:webGlPixelRender
  });
})();
