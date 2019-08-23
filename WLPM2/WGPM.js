
var WGPM=(function(){
  function MAWebGlPixelRender(pixelArray, outputCanvas) {
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

    var primitiveType =gl.LINES;
    var offset = 0;
    var count = pixelArray.length/2;
    gl.drawArrays(primitiveType, offset, count);
  }

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

    var primitiveType =gl.LINES;
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

    gl.uniform2f(locations.textureSize, inputCanvases[0].width, inputCanvases[0].height); //set texture size
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

    gl.viewport(0, 0, inputCanvases[0].width, inputCanvases[0].height);



    gl.clearColor(0.0, 0.5, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
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
    MAWebGlPixelRender:MAWebGlPixelRender,
    webGlShaderRender:webGlShaderRender,
    webGlPixelRender:webGlPixelRender
  });
})();
