<template>
  <div class="canvas-wrapper">
  </div>
</template>

<script>
import * as THREE from 'three';
import sample from "lodash/sample";
import chroma from 'chroma-js';
import utils from '../../utils/three-utils';
import RjMesh from '../../utils/rj-mesh';

export default {
  name: 'VanishingCircles',
  props: {
    renderer: Object,
  },
  data: function () {
    return {
      intervalId: null,
    }
  },
  mounted() {
    ///////////////////////////////////////////////////////////////////////////////
    //   CONSTANTS

    const RING_MAX_RADIUS = 160;
    const CAM_POS = new THREE.Vector3(0, 0, -15);
    const CAM_TARGET = new THREE.Vector3(0, 0, 500);
    const LIGHT_POS = new THREE.Vector3(CAM_POS.x, CAM_POS.y, -50);
    const UPDATES_PER_SECOND = 20;
    const RENDERER = this.renderer;

    const NUM_BALLS = 27;
    const NUM_RINGS = 5;
    const BALLS_PER_RING = 5;

    ///////////////////////////////////////////////////////////////////////////////
    //   THREE.JS ESSENTIALS

    RENDERER.setSize (this.$el.clientWidth, this.$el.clientHeight);
    this.$el.appendChild (RENDERER.domElement);

    let scene = new THREE.Scene ();
    const aspectRatio = this.$el.clientWidth / this.$el.clientHeight
    let camera = new THREE.PerspectiveCamera (45, aspectRatio , 1, 1500);
    camera.position.set(CAM_POS.x, CAM_POS.y, CAM_POS.z);
    camera.lookAt(CAM_TARGET);

    let light = new THREE.DirectionalLight ('white', 1.0);
    light.position.set (LIGHT_POS.x, LIGHT_POS.y, LIGHT_POS.z);
    scene.add (light);

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN OBJECTS

    const ballRadius = 45;
    const ballGeo = new THREE.SphereBufferGeometry(ballRadius);
    let ballMat;

    let newBall;
    let ringRadius;
    let ringDepth;
    let circleInputs;
    let inputMin;
    let circleCoord;
    const inputMax = 100;

    const balls = [];
    const ballGroups = [];
    const ballGroupRotations = [];
    for(let i = 0; i < NUM_RINGS; i++) {
      ballGroups.push(new THREE.Group ());
      ballGroupRotations.push(140 + (i * 100));

      ringRadius = RING_MAX_RADIUS - (7 * i);
      ringDepth = 200 + (210 * i);
      inputMin = inputMax / BALLS_PER_RING * 0.7;
      circleInputs = utils.splitRough(inputMax, BALLS_PER_RING, inputMin, false);

      for(let cInput of circleInputs) {
        circleCoord = utils.circleFunction(cInput, inputMax, ringRadius);
        ballMat = new THREE.MeshLambertMaterial({
          color: 0x880000,
          flatShading: true,
          transparent: true,
        });
        newBall = new RjMesh(new THREE.Mesh(ballGeo, ballMat));
        newBall.mesh.position.set(circleCoord.x, circleCoord.y, ringDepth);
        ballGroups[i].add(newBall.mesh);
        balls.push(newBall);

        const distance = newBall.mesh.position.distanceTo(new THREE.Vector3(200, 200, -100));
        const delay1 = Math.pow(distance, 1.075);
        const delay2 = delay1 + 3000;
        newBall.setFadeOutInDelay(delay1, delay1 + 550, true);
        newBall.setFadeOutInDelay(delay2, delay2 + 550, true);
      }

      scene.add(ballGroups[i]);
    }

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN RENDER/UPDATE LOOPS

    this.intervalId = window.setInterval (function () {
      const currentTime = Date.now () / 1000;
      for(let i = 0; i < BALLS_PER_RING; i++) {
        ballGroups[i].rotateZ(Math.PI / ballGroupRotations[i]);
      }
      const cameraOffset = utils.periodicFunction(currentTime, 10, 0, 175);
      camera.position.set(CAM_POS.x, CAM_POS.y, CAM_POS.z + cameraOffset);
    }, 1000 / UPDATES_PER_SECOND);

    // Render loop
    let render = function () {
      requestAnimationFrame (render);
      RENDERER.render (scene, camera);
    };

    render ();

    ///////////////////////////////////////////////////////////////////////////////
    //   HANDLING WINDOW RESIZES

    const canvasElement = this.$el;
    function resizeRenderer(evt) {
      camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
      RENDERER.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
      camera.updateProjectionMatrix();
    };

    const resizeHandler = evt => {
      resizeRenderer(evt);
    };

    const delay = 100;  // Your delay here

    (() => {
      let resizeTaskId = null;

      window.addEventListener('resize', evt => {
        if (resizeTaskId !== null) {
          clearTimeout(resizeTaskId);
        }

        resizeTaskId = setTimeout(() => {
          resizeTaskId = null;
          resizeHandler(evt);
        }, delay);
      });
    })();
  },
  beforeDestroy() {
    window.clearInterval(this.intervalId);
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/vars.scss";

  .canvas-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
