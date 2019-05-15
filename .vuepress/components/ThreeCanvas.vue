<template>
  <div class="canvas-wrapper">
  </div>
</template>

<script>
import * as THREE from 'three';

export default {
  name: 'ThreeCanvas',
  mounted() {
    ///////////////////////////////////////////////////////////////////////////////
    //   CONSTANTS

    const LIGHT_POS = new THREE.Vector3(2, 3, 1);
    const CAMERA_POS = new THREE.Vector3(25, 15, 30);
    const CAMERA_TARGET = new THREE.Vector3(0, -25, -10);
    const UPDATES_PER_SECOND = 24;

    const GRID_WIDTH = 4;
    const GRID_LENGTH = 4;
    const GRID_UNIT_LENGTH = 8;
    const GRID_GUTTER_SIZE = 1;
    // assigned to vars for closures below
    const WINDOW_WIDTH = this.$el.clientWidth;
    const WINDOW_HEIGHT = this.$el.clientHeight;

    ///////////////////////////////////////////////////////////////////////////////
    //   THREE.JS ESSENTIALS

    let scene = new THREE.Scene ();
    let camera = new THREE.PerspectiveCamera (
      45,
      this.$el.clientWidth / this.$el.clientHeight,
      1,
      1000
    );
    camera.position.set (CAMERA_POS.x, CAMERA_POS.y, CAMERA_POS.z);
    camera.lookAt (CAMERA_TARGET);

    let renderer = new THREE.WebGLRenderer ({antialias: true});
    renderer.setSize (this.$el.clientWidth, this.$el.clientHeight);
    const canvasWrapper = this.$el;
    canvasWrapper.appendChild (renderer.domElement);

    let light = new THREE.DirectionalLight ('white', 0.8);
    light.position.set (LIGHT_POS.x, LIGHT_POS.y, LIGHT_POS.z);
    scene.add (light);

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN OBJECTS

    // Creating boxes
    const boxes = [];
    const gridBoxGroup = new THREE.Group ();
    const gridBoxGeometry = new THREE.BoxBufferGeometry (GRID_UNIT_LENGTH, GRID_UNIT_LENGTH, GRID_UNIT_LENGTH);
    const gridBoxMaterial = new THREE.MeshLambertMaterial ({
      color: 0xdd0000,
      flatShading: true,
    });
    let newBox;
    for (let i = 0; i < GRID_LENGTH; i++) {
      for (let j = 0; j < GRID_WIDTH; j++) {
        newBox = new THREE.Mesh (gridBoxGeometry, gridBoxMaterial);
        newBox.position.setX(i * (GRID_UNIT_LENGTH + GRID_GUTTER_SIZE));
        newBox.position.setZ(j * (GRID_UNIT_LENGTH + GRID_GUTTER_SIZE));
        boxes.push(newBox);
        gridBoxGroup.add(newBox);
      }
    }
    scene.add (gridBoxGroup);


    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN RENDER/UPDATE LOOPS

    // Update loop
    // window.setInterval (function () {
    //   const currentTime = Date.now () / 1000;

    //   Rotate star globe
    //   starGroup.rotateY (Math.PI / 180);
    //   starGroup.rotateZ (Math.PI / 360);
    // }, 1000 / UPDATES_PER_SECOND);

    // Render loop
    let render = function () {
      requestAnimationFrame (render);
      renderer.render (scene, camera);
    };

    render ();

    ///////////////////////////////////////////////////////////////////////////////
    //   HANDLING WINDOW RESIZES

    const canvasElement = this.$el;
    function resizeRenderer(evt) {
      console.log(evt, canvasElement);
      camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
      renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
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
}
</script>

<style scoped lang="scss">
  @import "../styles/vars.scss";

  .canvas-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -100
  }
</style>
