import { MeshBasicMaterial } from "three";

export const materialPropsRed = {
  baseMaterial: MeshBasicMaterial,
  fragmentShader: `
    varying float vWobble;

    uniform float u_Time;

    void main() {
      float wobble = vWobble * 0.5 + 0.5;
      csm_FragColor = mix(vec4(1.5, 0.0, 0.0, 1.0), vec4(1.2, 0.6, 0.8, 1.0), wobble);
    }
  `,
  vertexShader: `
    uniform float u_Time;
    uniform float u_WobbleSpeed;
    uniform float u_WobbleAmplitude;
    uniform float u_WobbleFrequency;

    varying float vWobble;

    void main() {
      float wobble = sin(csm_Position.z * u_WobbleFrequency + u_Time * u_WobbleSpeed);
      csm_Position += normal * wobble * u_WobbleAmplitude;

      vWobble = wobble;
    }
  `,
  uniforms: {
    u_Time: { value: 0 },
    u_WobbleSpeed: { value: 2 },
    u_WobbleAmplitude: { value: 0.01 },
    u_WobbleFrequency: { value: 1 },
  },
};

export const materialPropsBlue = {
  baseMaterial: MeshBasicMaterial,
  fragmentShader: `
    varying float vWobble;

    uniform float u_Time;

    void main() {
      float wobble = vWobble * 0.5 + 0.5;
      csm_FragColor = mix(vec4(0.0, 0.0, 1.5, 1.0), vec4(0.0, 0.6, 1.0, 1.0), wobble);
    }
  `,
  vertexShader: `
    uniform float u_Time;
    uniform float u_WobbleSpeed;
    uniform float u_WobbleAmplitude;
    uniform float u_WobbleFrequency;

    varying float vWobble;

    void main() {
      float wobble = sin(csm_Position.z * u_WobbleFrequency + u_Time * u_WobbleSpeed);
      csm_Position += normal * wobble * u_WobbleAmplitude;

      vWobble = wobble;
    }
  `,
  uniforms: {
    u_Time: { value: 0 },
    u_WobbleSpeed: { value: 2 },
    u_WobbleAmplitude: { value: 0.01 },
    u_WobbleFrequency: { value: 1 },
  },
};
