import * as THREE from "three";

export const setPositionalAudioToObject = (
  options = {
    src: "/sounds/strudel/simplebeat.mp3",
    object: null,
    listener: null,
    sounds: null,
    autoplay: true,
    loop: true,
    volume: 1,
    playbackRate: 1,
  }
) => {
  let sound = new THREE.PositionalAudio(options.listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(options.src, function (buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(1.0);
    sound.setRolloffFactor(1.0);
    sound.setMaxDistance(10000);
    sound.setDistanceModel("exponential");
    sound.setLoop(true);
    sound.setVolume(1);
    sound.setPlaybackRate(1);
    if (options.autoplay) {
      sound.play();
    }
  });
  options.sounds?.push(sound);
  options.object?.add(sound);
  return sound;
};

export class AudioMesh {
  //put main class Boule logic here
}

export class Boule {
  // implement everything from AudioMesh but make it a sphere
  constructor(
    options = {
      x: 0,
      y: 0,
      z: 0,
      size: 1,
      color: "#555",
      opacity: 0.8,
      player: 2,
      class: "light",
      distance: 0,
      listener: null,
      sounds: [],
      autoplay: true,
      soundSrc: "/sounds/waterBigger.m4a",
      scene: null,
    }
  ) {
    this.options = options;
    this.mesh = null;
    this.sound = null;
    this.create();
  }

  create() {
    const geometry = new THREE.SphereGeometry(this.options.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: this.options.color,
      transparent: true,
      opacity: this.options.opacity,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.options.x, this.options.z || 0, this.options.y);

    if (this.options.listener) {
      this.sound = setPositionalAudioToObject({
        src: this.options.soundSrc,
        object: this.mesh,
        listener: this.options.listener,
        sounds: this.options.sounds,
        autoplay: this.options.autoplay,
      });
    }

    if (this.options.scene) this.addToScene(scene);

    return this.mesh;
  }

  stopSound() {
    if (this.sound) {
      this.sound.stop();
    }
  }

  playSound() {
    if (this.sound) {
      this.sound.play();
    }
  }

  addToScene(scene) {
    if (this.mesh) {
      scene.add(this.mesh);
    }
  }

  removeFromScene(scene) {
    if (this.mesh) {
      scene.remove(this.mesh);
      if (this.sound) {
        this.sound.stop();
      }
    }
  }

  setPosition(x, y, z = 0) {
    if (this.mesh) {
      this.mesh.position.set(x, z, y);
    }
  }

  getPosition() {
    if (this.mesh) {
      return {
        x: this.mesh.position.x,
        y: this.mesh.position.z,
        z: this.mesh.position.y,
      };
    }
    return null;
  }
}

export class Startpoint {
  //Todo implement everything from class Boule except use a cylinder mesh instead of a sphere
}

export function createSphere(options: {
  size: 0.05;
  color: "#ff0000";
  opacity: 1;
}) {
  const sphereGeometry = new THREE.SphereGeometry(options.size, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: options.color,
    transparent: true,
    opacity: options.opacity,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  return sphere;
}

export function intersectWithPlane(options: {
  x: 0;
  y: 0;
  plane: null;
  camera: null;
}) {
  const raycaster = new THREE.Raycaster();
  const input = new THREE.Vector2();
  (input.x = (options.x / 2 / window.innerWidth) * 2 - 1),
    (input.y = -(options.y / 2 / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(input, options.camera);
  const intersects = raycaster.intersectObject(options.plane);
  return intersects;
}