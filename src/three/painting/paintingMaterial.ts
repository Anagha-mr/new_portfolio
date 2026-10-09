import * as THREE from "three";

/**
 * Every particle's position is a pure function of its home, its seeds and
 * `uProgress`, so the same scroll position always yields the same frame and
 * scrolling back reassembles the painting exactly. Nothing accumulates.
 */
const vertexShader = /* glsl */ `
  // position: painting-space home (u, v) and depth.
  attribute vec3 aColor;
  attribute vec3 aShape;
  attribute vec4 aSeed;
  // 0 for a brush fleck; otherwise a soft star-halo particle and its peak alpha.
  attribute float aGlow;

  uniform float uProgress;
  uniform vec2 uViewport;
  uniform vec4 uRect;
  uniform float uScale;
  uniform float uPixelRatio;
  uniform vec4 uText;
  uniform float uTextDim;

  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vAxis;
  varying float vElong;
  varying float vGlow;

  vec2 rotate2(vec2 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
  }

  // Smooth low-frequency field (about -1..1): neighbours share values, so
  // regions release together and travel in coherent currents.
  float field(vec2 p) {
    return (sin(p.x * 4.1 + sin(p.y * 3.3) * 1.7)
      + sin(p.y * 5.3 - p.x * 2.2 + 1.3) * 0.8
      + sin((p.x + p.y) * 7.9) * 0.3) / 2.1;
  }

  void main() {
    vec2 uv = position.xy;
    float depth = position.z;
    vec2 home = uRect.xy + uv * uRect.zw;

    // Brush-stroke direction in screen space; the rect may be stretched.
    vec2 stroke = normalize(vec2(cos(aShape.x) * uRect.z, sin(aShape.x) * uRect.w) + 1e-5);

    // Staggered onset. Early scroll only loosens; the bulk lets go mid-scroll.
    float region = field(uv * 1.3) * 0.5 + 0.5;
    float start = 0.08 + 0.4 * (region * 0.55 + aSeed.x * 0.45);
    float t = smoothstep(start, start + 0.5, uProgress);
    // Distance eases in, so mid-scroll loosens the painting before it lets go.
    float travel = t * t;

    // Heading: unwinding along the stroke, a shared regional current, a slight outward push.
    float heading = field(uv * 2.1 + 3.7) * 3.2;
    vec2 current = vec2(cos(heading), sin(heading));
    float side = field(uv * 3.1 + 9.2) >= 0.0 ? 1.0 : -1.0;
    vec2 outward = normalize(home - (uRect.xy + uRect.zw * 0.5) + 1e-3);
    vec2 dir = normalize(stroke * side * 0.9 + current * 0.7 + outward * 0.45 + (aSeed.yz - 0.5) * 0.6);

    // Trajectories bend as they travel, so flecks peel away in arcs.
    float curl = (aSeed.w - 0.5) * 2.6 + heading * 0.25;
    vec2 path = rotate2(dir, curl * t);
    float dist = uScale * (0.05 + 0.6 * pow(aSeed.z, 1.6)) * (0.55 + 0.9 * depth);

    vec2 pos = home + path * dist * travel;
    pos += (aSeed.wy - 0.5) * uScale * 0.014 * smoothstep(0.0, 0.3, uProgress);

    // Late: part of the field fades, the rest stays as dispersed starlight.
    float keep = step(0.42, aSeed.y);
    float alpha = mix(1.0, mix(0.06, 0.85, keep), smoothstep(0.4, 1.0, t));
    // Halos belong to the formed painting: they fade as their star lets go.
    if (aGlow > 0.0) alpha = aGlow * (1.0 - smoothstep(0.0, 0.45, t));

    // Keep the typography clear, before and during dissociation.
    if (uText.z > 0.0) {
      vec2 halfSize = uText.zw * 0.5;
      vec2 q = abs(pos - (uText.xy + halfSize)) - halfSize;
      float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
      float pad = 0.09 * uScale;
      alpha *= 1.0 - uTextDim * (1.0 - smoothstep(-pad * 0.5, pad, d));
    }
    // A slightly darker top band keeps the navigation legible; the bottom
    // fades out so the stage leaves without a hard edge as the hero scrolls away.
    float screenY = pos.y / uViewport.y;
    alpha *= mix(0.4, 1.0, smoothstep(0.02, 0.12, screenY)) * smoothstep(1.0, 0.92, screenY);

    // Strokes relax into points of light as they travel.
    vElong = mix(aShape.z, 1.0 + (aShape.z - 1.0) * 0.4, t);
    vAxis = normalize(mix(stroke, path, t) + 1e-5);
    vColor = aColor;
    vAlpha = alpha;
    vGlow = aGlow;

    float size = aShape.y * (1.0 + t * depth * 0.8);
    // Halo sizes are a share of the painting height, so they scale with it.
    if (aGlow > 0.0) {
      vElong = 1.0;
      size = aShape.y * uRect.w;
    }
    gl_PointSize = max(1.0, size * vElong * uPixelRatio);
    gl_Position = vec4(pos.x / uViewport.x * 2.0 - 1.0, 1.0 - pos.y / uViewport.y * 2.0, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vAxis;
  varying float vElong;
  varying float vGlow;

  void main() {
    // An elongated fleck along the stroke, not a round dot.
    vec2 p = gl_PointCoord - 0.5;
    vec2 r = vec2(dot(p, vAxis), dot(p, vec2(-vAxis.y, vAxis.x)) * vElong);
    float d = length(r) * 2.0;
    // Halos: a Gaussian falloff that reaches zero before the sprite edge, so no rim.
    float shape = vGlow > 0.0 ? exp(-d * d * 4.0) * (1.0 - smoothstep(0.85, 1.0, d)) : 1.0 - smoothstep(0.45, 1.0, d);
    float a = shape * vAlpha * uOpacity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export type PaintingUniforms = {
  uProgress: { value: number };
  uViewport: { value: THREE.Vector2 };
  uRect: { value: THREE.Vector4 };
  uScale: { value: number };
  uPixelRatio: { value: number };
  uText: { value: THREE.Vector4 };
  uTextDim: { value: number };
  uOpacity: { value: number };
};

export function createPaintingMaterial() {
  const uniforms: PaintingUniforms = {
    uProgress: { value: 0 },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uRect: { value: new THREE.Vector4(0, 0, 1, 1) },
    uScale: { value: 1 },
    uPixelRatio: { value: 1 },
    uText: { value: new THREE.Vector4(0, 0, 0, 0) },
    uTextDim: { value: 0.7 },
    uOpacity: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  return { material, uniforms };
}
