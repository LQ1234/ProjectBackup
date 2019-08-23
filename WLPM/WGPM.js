var WGPM = function(inputCanvas) {
  var shaderCoordScripts = [

  ];
  var shaderColorScripts = [
    `
    /*
    if(inputColor.a>0.0){
      resultColor=vec4(0,0,0,1);
    }
    */
    `
  ];

  var inputCanvases = [ //image
    inputCanvas
  ];
  var ret = {
    addCoordScript: function(script) {
      shaderCoordScripts.push(script)
    },
    addColorScript: function(script) {
      shaderColorScripts.push(script)
    },
    wavy: wavyEffect,
    pinch: pinchEffect,
    magnify: magnifyEffect,
    noiseWave:noiseWaveEffect,
    noiseColor:noiseColorEffect,
    finish: renderFromCanvas,
  };

  function nullor(a,b){
    if(a===null||a===undefined){
      return(b);
    }
    return(a);

  }
  function addCanvasAsTexture(canvas) {
    inputCanvases.push(canvas);
    return (inputCanvases.length - 1);
  }

  function wavyEffect(horizontalFreq, verticalFreq, horizontalMultiplier, verticalMultiplier, horizontalOffset, verticalOffset) {
    this.addCoordScript(`
    vec2 sin=sin((inputCoords+vec2(${nullor(horizontalOffset,.1)},${nullor(verticalOffset,.1)}))*vec2(${nullor(horizontalFreq,.1)},${nullor(verticalFreq,.1)}))*vec2(${nullor(horizontalMultiplier,5)},${nullor(verticalMultiplier,5)});
    resultCoords+=vec2(sin.y,sin.x);
    `);
    return (this);
  }

  function pinchEffect(xcoord, ycoord, multiplier) {
    this.addCoordScript(`
      vec2 loc=vec2(${nullor(xcoord,150)},${nullor(ycoord,150)});
    float dist=distance(loc,inputCoords);
    vec2 effect=(inputCoords-loc)/(dist+1.0)*float(${nullor(multiplier,20)});
    resultCoords+=effect;
    `);
    return (this);
  }

  function magnifyEffect(xcoord, ycoord, radius) {
    this.addCoordScript(`
    vec2 loc=vec2(${nullor(xcoord,150)},${nullor(ycoord,150)});
    float dist=distance(loc,inputCoords);
    if(float(${radius})>dist){
      resultCoords=mix(loc,resultCoords,sqrt(dist/float(${radius})));
    }
    `);
    return (this);
  }
  function twoDimNoise(seed, timeEvolution,width, height, horizontalFreq, verticalFreq, horizontalOffset, verticalOffset) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    var imageData = ctx.createImageData(width, height);

    noise.seed(seed);
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {

        var value = noise.simplex3(timeEvolution,(x + nullor(horizontalOffset , 0)) * nullor(horizontalFreq,.01), (y + nullor(verticalOffset , 0)) * nullor(verticalFreq,.01));
        value = (value + 1) / 2;
        imageData.data[4 * (x + y * width)] = Math.floor(value * 255);
        imageData.data[4 * (x + y * width) + 3] = 255;
      }
    }
    seed = seed >= .5 ? seed - .5 : seed + .5;
    noise.seed(seed);
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var value = noise.simplex3(timeEvolution,(x + nullor(horizontalOffset , 0)) * nullor(horizontalFreq,.01), (y + nullor(verticalOffset , 0)) * nullor(verticalFreq,.01));
        value = (value + 1) / 2;
        imageData.data[4 * (x + y * width) + 1] = Math.floor(value * 255);
      }
    }
    ctx.putImageData(imageData, 0, 0);
    //document.body.append(canvas);
    return (canvas);
  }
  function noiseColorEffect(color,seed,timeEvolution,multiplier, horizontalFreq, verticalFreq, horizontalOffset, verticalOffset){
    var texid=addCanvasAsTexture(twoDimNoise(seed,timeEvolution, inputCanvases[0].width, inputCanvases[0].height, horizontalFreq, verticalFreq, horizontalOffset, verticalOffset));
    var texname="u_image"+texid;
    this.addColorScript(`
    vec4 colorattex=texture2D(${texname}, resultCoords/u_textureSize);
    vec3 color=vec3(${color.r},${color.g},${color.b});
    //color=mix(vec3(resultColor.r,resultColor.g,resultColor.b),color,.5);
    //if(resultColor.a==0.0)resultColor=vec4(1.0,1.0,1.0,1.0);
    resultColor=mix(resultColor,vec4(color,1),colorattex.r*.3+.5);

    `);
    return(this);
  }
  function noiseWaveEffect(seed,timeEvolution,multiplier, horizontalFreq, verticalFreq, horizontalOffset, verticalOffset){
    var texid=addCanvasAsTexture(twoDimNoise(seed,timeEvolution, inputCanvases[0].width, inputCanvases[0].height, horizontalFreq, verticalFreq, horizontalOffset, verticalOffset));
    var texname="u_image"+texid;
    this.addCoordScript(`
    vec4 colorattex=texture2D(${texname}, resultCoords/u_textureSize);

    resultCoords+=vec2(colorattex.r*float(${nullor(multiplier,5)}),colorattex.g*float(${nullor(multiplier,5)}));
    `);
    return(this);
  }
  // Note: most of the code below is from https://webglfundamentals.org/webgl/webgl-2d-image-blend.html




  function canvasesToImage(canvases, callback) {
    var images = [];
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i],
        dataUrl = canvas.toDataURL(),
        image = document.createElement('img');
      image.src = dataUrl;
      images.push(image);
    }
    var toLoad = images.length;
    for (var i = 0; i < images.length; i++) {
      images[i].onload = function() {
        toLoad--;
        if (toLoad === 0) {
          callback(images);
        }
      }
    }
  }

  function renderFromCanvas(outputCanvas, callback) {


    var vertexShaderSource =
      `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;

    uniform vec2 u_resolution;

    varying vec2 v_texCoord;

    void main() {
       // convert the rectangle from pixels to 0.0 to 1.0
       vec2 zeroToOne = a_position / u_resolution;

       // convert from 0->1 to 0->2
       vec2 zeroToTwo = zeroToOne * 2.0;

       // convert from 0->2 to -1->+1 (clipspace)
       vec2 clipSpace = zeroToTwo - 1.0;

       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

       // pass the texCoord to the fragment shader
       // The GPU will interpolate this value between points.
       v_texCoord = a_texCoord;
    }
    `;
    var str = "";

    inputCanvases.forEach((a, b) => {
      str += "uniform sampler2D u_image" + b + ";\n"
    });
    var fragmentShaderSource =
      `
    precision  highp float;

    // our texture
    ${str}

    uniform vec2 u_textureSize;

    // the texCoords passed in from the vertex shader.
    varying vec2 v_texCoord;
    void main() {
      vec2 inputCoords=v_texCoord*u_textureSize;
      vec2 resultCoords=v_texCoord*u_textureSize;
      {
      ${shaderCoordScripts.join("\n")}
    }
      vec4 inputColor=texture2D(u_image0, resultCoords/u_textureSize);
      vec4 resultColor=texture2D(u_image0, resultCoords/u_textureSize);

      ${shaderColorScripts.join("\n")}

       gl_FragColor = resultColor;
    }
    `;
    //console.log(fragmentShaderSource);
    canvasesToImage(inputCanvases,
      function(inputImages) {
        render(inputImages, outputCanvas, vertexShaderSource, fragmentShaderSource);
        callback(outputCanvas);
      }
    )


  }

  function render(inputImages, outputCanvas, vertexShaderSource, fragmentShaderSource) {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var image = inputImages[0];
    var canvas = outputCanvas;
    var gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }
    // setup GLSL program
    var program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, image.width, image.height);

    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0,
    ]), gl.STATIC_DRAW);

    var textures=[];
    for (var i = 0; i < inputImages.length; i++) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // Upload the image into the texture.

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inputImages[i]);

      textures.push(texture);
    }
    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels (-1 => 1 to 0 => width/height)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);



    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionLocation, size, type, normalize, stride, offset);

    // Turn on the teccord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      texcoordLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // set the size of the image
    gl.uniform2f(textureSizeLocation, image.width, image.height);

    for (var i = 0; i < textures.length; i++) {
    //  i=1;
      var imageLocation = gl.getUniformLocation(program, "u_image" + i);

      // set which texture units to render with.
      gl.uniform1i(imageLocation, i);

      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    }


    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }



  function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), gl.STATIC_DRAW);
  }


  return (ret);
};
