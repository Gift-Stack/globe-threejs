varying vec2 vertexUV;

void main() {
  vertexUV = uv;
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}