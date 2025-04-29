<template>
  <TresPerspectiveCamera
    :args="[45, 1, 0.1, 1000]"
    :position="[0, 3.7, 0]"
    :rotation="[Math.PI / 2, Math.PI / 2, 0]"
  />
  <OrbitControls make-default />
  <TransformControls :object="boule" />
  <Environment preset="sunset" />
  <Sky :azimuth="53" :elevation="2" />
  <!-- <TresAmbientLight :intensity="1" /> -->
  <TresDirectionalLight :intensity="1" :position="[10, 3, 10]" cast-shadow />
  <TresMesh cast-shadow receive-shadow :position="[0.1, 0.3, -0.5]" ref="boule">
    <TresSphereGeometry :args="[0.25, 24, 24]" />
    <TresMeshPhysicalMaterial
      :roughness="0.4"
      :metalness="1"
      :emissive="'#111111'"
    />
  </TresMesh>
  <TresMesh cast-shadow receive-shadow :position="[.4, 0.3, 1]" ref="boule2">
    <TresSphereGeometry :args="[0.25, 24, 24]" />
    <TresMeshPhysicalMaterial
      :roughness="0.4"
      :metalness="1"
      :emissive="'#111111'"
    />
  </TresMesh>
  <TresMesh cast-shadow receive-shadow :position="[-.5, 0.3, 1]" ref="boule2">
    <TresSphereGeometry :args="[0.25, 24, 24]" />
    <TresMeshPhysicalMaterial
      :roughness="0.3"
      :metalness=".7"
      :emissive="'#999999'"
    />
  </TresMesh>
  <TresMesh cast-shadow receive-shadow :position="[0, 0.15, 0]" ref="boule2">
    <TresSphereGeometry :args="[0.1, 24, 24]" />
    <TresMeshPhysicalMaterial
      :roughness=".1"
      :metalness="0"
      :emissive="'yellow'"
    />
  </TresMesh>
  <Suspense>
    <GravelFloor />
  </Suspense>
  <Suspense>
    <Trunk :rotation="[0,0,0]" :position="[0,0,-5]" :scale="[4.5,1.6,1.4]" />
  </Suspense>
  <!-- <Suspense>
    <Trunk :rotation="[Math.PI/2,0,0]" :position="[0,0,5]" :scale="[4.5,1.6,1.4]" />
  </Suspense> -->
  <Suspense>
    <Trunk :rotation="[0,Math.PI/2+.02,0]" :position="[-5,0,1]" :scale="[4.5,1.6,1.4]" />
  </Suspense>
  <Suspense>
    <Trunk :rotation="[0,-Math.PI/2-.02,0]" :position="[5,0,0]" :scale="[4.8,1.5,1.5]" />
  </Suspense>
</template>

<script setup>
import { useLoop } from "@tresjs/core";
import {
  OrbitControls,
  Environment,
  TransformControls,
  Sky,
} from "@tresjs/cientos";

const { width, height } = useWindowSize();
const { x, y } = useMouse();

const boule = shallowRef(null);

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta, elapsed }) => {
  if (boule.value) {
    // boule.value.position.z = map(y.value, 0, height.value, -3, 3);
  }
});
</script>
