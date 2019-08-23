function webGlPixelRender(particlePV,particleT, outputCanvas) {
 var vertexShaderScript=`
 attribute vec4 particlePV;
 attribute float particleT;

 uniform vec2 textureSize;
 vec2 getLocationAt(float n,vec4 data)  {
   float sx=data.x;
   float sy=data.y;
   float sxv=data.z;
   float syv=data.w;
   return( vec2(sx + n * sxv, -(n * n) + syv * n + sy) );
 }
 void main() {
   gl_Position = vec4((getLocationAt(particleT,particlePV)/textureSize)*2.0, 0, 1);
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

   particlePV: gl.getAttribLocation(program, "particlePV"),
   particleT: gl.getAttribLocation(program, "particleT"),

   textureSize: gl.getUniformLocation(program, "textureSize"),//size of texture (for fragment shader)
 }

 gl.uniform2f(locations.textureSize, outputCanvas.width, outputCanvas.height); //set texture size

 var particlePVBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, particlePVBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particlePV), gl.STATIC_DRAW);
 gl.enableVertexAttribArray(locations.particlePV);
 gl.vertexAttribPointer(locations.particlePV, 4, gl.FLOAT, false, 0, 0);

 var particleTBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, particleTBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particleT), gl.STATIC_DRAW);
 gl.enableVertexAttribArray(locations.particleT);
 gl.vertexAttribPointer(locations.particleT, 1, gl.FLOAT, false, 0, 0);


 gl.viewport(0, 0, outputCanvas.width, outputCanvas.height);

 gl.clearColor(0, 0, 0, 0);
 gl.clear(gl.COLOR_BUFFER_BIT);

 var primitiveType =gl.POINTS;
 var offset = 0;
 var count = particlePV.length/4;
 gl.drawArrays(primitiveType, offset, count);
}
function render(){
  webGlPixelRender(particlePV,particleT,document.getElementById('render'));
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
