<template>
  <div class="canvas-wrapper">
  </div>
</template>

<script>
import * as THREE from 'three';
import sample from "lodash/sample";
import chroma from 'chroma-js';
import utils from '../../utils/three-utils';

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

    const BALL_BOX = new THREE.Vector3(100, 100, 300);
    const CAM_POS = new THREE.Vector3(BALL_BOX.x / 2, BALL_BOX.y / 2, -10);
    const CAM_TARGET = new THREE.Vector3(BALL_BOX.x / 2, BALL_BOX.y / 2, 300);
    const LIGHT_POS = new THREE.Vector3(CAM_TARGET.x, CAM_TARGET.y, -50);
    const UPDATES_PER_SECOND = 20;
    const RENDERER = this.renderer;

    const NUM_BALLS = 25;

    ///////////////////////////////////////////////////////////////////////////////
    //   THREE.JS ESSENTIALS

    RENDERER.setSize (this.$el.clientWidth, this.$el.clientHeight);
    this.$el.appendChild (RENDERER.domElement);

    let scene = new THREE.Scene ();
    const aspectRatio = this.$el.clientWidth / this.$el.clientHeight
    let camera = new THREE.PerspectiveCamera (45, aspectRatio , 1, 1000);
    camera.position.set(CAM_POS.x, CAM_POS.y, CAM_POS.z);
    camera.lookAt(CAM_TARGET);

    let light = new THREE.DirectionalLight ('white', 1.0);
    light.position.set (LIGHT_POS.x, LIGHT_POS.y, LIGHT_POS.z);
    scene.add (light);

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN OBJECTS

    const ballRadius = 8;
    const ballGeo = new THREE.SphereBufferGeometry(ballRadius);
    const ballMat = new THREE.MeshLambertMaterial({
      color: 0x880000,
      flatShading: true,
    });

    let newBall;
    let newCoords;
    for(let i = 0; i < NUM_BALLS; i++) {
      newBall = new THREE.Mesh(ballGeo, ballMat);
      newCoords = {
        x: utils.getRandomInt(0, BALL_BOX.x),
        y: utils.getRandomInt(0, BALL_BOX.y),
        z: utils.getRandomInt(0, BALL_BOX.z),
      }
      newBall.position.set(newCoords.x, newCoords.y, newCoords.z);
      scene.add(newBall);
    }

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN RENDER/UPDATE LOOPS

    // this.intervalId = window.setInterval (function () {
    //   const currentTime = Date.now () / 1000;
    // }, 1000 / UPDATES_PER_SECOND);

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
