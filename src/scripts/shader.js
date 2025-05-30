// Initialize WebGL
const canvas = document.getElementById("shader-canvas");
const gl =
  canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

if (!gl) {
  alert("WebGL not supported");
}

// Resize canvas to fill the screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create vertex shader
const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Fragment shader - replace this with your own shader code
const fragmentShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

float Star(vec2 uv, float flare, float ball, float t) {
	float d = length(uv);
    float m = .05/d*ball;
    float r = uv.x*uv.y;
    float rays = max(0., 1.-(pow(abs(r), 1.7))*1000.);
    rays *= (sin(t*.5)*.5+.5);
    m += rays*flare;
    
    m *= smoothstep(1., .2, d);
    return m;
}

float Hash21(vec2 p) {
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p+45.32);
    return fract(p.x*p.y);
}

vec3 StarLayer(vec2 uv, float p) {
	vec3 col = vec3(0);
	
    vec2 gv = fract(uv)-.5;
    vec2 id = floor(uv);
    
    for(int y=-1;y<=1;y++) {
    	for(int x=-1;x<=1;x++) {
            vec2 offs = vec2(x, y);
            
    		float n = Hash21(id+offs); // random between 0 and 1
            float size = fract(n*345.32)*.75;
            float t = u_time*+n*6.2831;
            
    		float star = Star(gv-offs-vec2(n, fract(n*34.))+.5, smoothstep(.5, 7., size)*20., .1, t);
            // Only draw stars with a certain chance
            if(fract(n*1221.2) < p) {
                col += star*size;
            }
            
            //col += star*size;
        }
    }
    //col = smoothstep(0.01, 0.05, col);
    if (col.x < 0.04) { 
        col = vec3(0);
    } else {
        col = vec3(1);
    }
    return col;
}

// Permutation vector. Consider using a longer permutation for more variety
vec2 permute(vec2 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

// Function to create nebula-like effect
vec3 createNebula(vec2 uv) {
    uv = uv-u_time*0.02;
    // Base colors
    vec3 purple = vec3(1., 0.0, 1.);
    vec3 blue = vec3(0.0, 0.0, 1.);

    // Adjusted noise function call for seamless looping
    float n = fbm(uv*20.); // Use your noise function here
    float blackN = pow(fbm(uv*10.),2.0);

    // Blend between purple and blue based on noise
    vec3 color = mix(vec3(0.2), vec3(0.), n);
    color = mix(color, vec3(0.), blackN);

    return color;
}

void main() {

    vec2 screenSpaceCoords = gl_FragCoord.xy;
    vec2 uv = (screenSpaceCoords-0.5*u_resolution.xy)/u_resolution.y;
    uv *= 2.;
    vec3 col = vec3(0.);
    
    vec3 purple = vec3(0.5, 0.0, 0.5);
    vec3 blue = vec3(0.0, 0.0, 1.0);
    //col += createNebula((uv)*.5)*max(0.,-uv.y);
    col += StarLayer(((uv+112.3)+u_time*0.02)*30., 0.03);
    col += StarLayer(((uv+55.43)+u_time*0.03)*25., 0.035);
    col += StarLayer(((uv-5.1)+u_time*0.04)*20., 0.04);
    //gamma correction
    //col = pow(col, vec3(2.));
    

    gl_FragColor = vec4(col, 1.0);
}
`;

// Create and compile shaders
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

// Create program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error("Program link error:", gl.getProgramInfoLog(program));
}

// Get attribute and uniform locations
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const timeUniformLocation = gl.getUniformLocation(program, "u_time");
const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);

// Create buffer for the rectangle that covers the canvas
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Two triangles that cover the entire clip space
const positions = [
  -1,
  -1, // bottom left
  1,
  -1, // bottom right
  -1,
  1, // top left
  1,
  1, // top right
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Animation loop
function render(time) {
  time *= 0.001; // Convert to seconds

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Use our program
  gl.useProgram(program);

  // Set up the position attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Update uniforms
  gl.uniform1f(timeUniformLocation, time);
  gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

  // Draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
