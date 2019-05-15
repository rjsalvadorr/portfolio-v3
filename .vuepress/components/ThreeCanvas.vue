<template>
  <div class="canvas-wrapper">
  </div>
</template>

<script>
import * as THREE from 'three';
import sample from "lodash/sample";
import chroma from 'chroma-js';
import utils from '../utils/three-utils';

export default {
  name: 'ThreeCanvas',
  mounted() {
    ///////////////////////////////////////////////////////////////////////////////
    //   CONSTANTS

    const LIGHT_POS = new THREE.Vector3(2, 3, 1.25);
    const CAMERA_POS = new THREE.Vector3(34, 20, 34);
    const UPDATES_PER_SECOND = 24;

    const GRID_WIDTH = 5;
    const GRID_LENGTH = 5;
    const GRID_UNIT_LENGTH = 8;
    const GRID_GUTTER_SIZE = 0.5;
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
    let gridBoxGeometry;
    let gridBoxMaterial;
    const lightest = 'dd0000';
    const darkest = chroma(lightest).darken(4);
    const colorScale = chroma.scale([darkest, lightest]);
    const gridUnitWithGutter = GRID_UNIT_LENGTH + GRID_GUTTER_SIZE;
    let sceneLength = gridUnitWithGutter * GRID_LENGTH;
    let sceneWidth = gridUnitWithGutter * GRID_WIDTH;
    let newHeight;
    let newBox;

    console.log(colorScale(0).hex(), colorScale(0.5), colorScale(1))
    
    for (let i = 0; i < GRID_LENGTH; i++) {
      boxes[i] = [];

      for (let j = 0; j < GRID_WIDTH; j++) {
        newHeight = utils.getRandomInt(4, GRID_UNIT_LENGTH);
        gridBoxGeometry = new THREE.BoxBufferGeometry (
          GRID_UNIT_LENGTH,
          newHeight,
          GRID_UNIT_LENGTH,
        );
        gridBoxMaterial = new THREE.MeshLambertMaterial ({
          color: colorScale(sample([0.2, 0.4, 0.6, 0.8, 1.0])).hex(),
          flatShading: true,
        });
        newBox = new THREE.Mesh (gridBoxGeometry, gridBoxMaterial);
        newBox.position.setX(i * gridUnitWithGutter);
        newBox.position.setY(newHeight / 2);
        newBox.position.setZ(j * gridUnitWithGutter);
        boxes[i].push(newBox);
        gridBoxGroup.add(newBox);
      }
    }
    scene.add (gridBoxGroup);
    console.log(sceneLength, sceneWidth);
    const newCameraTarget = new THREE.Vector3(
      sceneLength / 2,
      0,
      sceneWidth / 2
    );
    camera.lookAt(newCameraTarget);

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
