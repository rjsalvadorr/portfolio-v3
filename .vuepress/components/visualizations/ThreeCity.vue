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
  name: 'ThreeCity',
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
    const LIGHT_POS = new THREE.Vector3(1, 5, 1);
    const UPDATES_PER_SECOND = 20;

    const GRID_WIDTH = 5;
    const GRID_LENGTH = 5;
    const GRID_UNIT_LENGTH = 10;
    const GRID_UNIT_HEIGHT = 8;
    const GRID_GUTTER_SIZE = 1.5;
    const RENDERER = this.renderer;

    ///////////////////////////////////////////////////////////////////////////////
    //   THREE.JS ESSENTIALS
    let scene = new THREE.Scene ();
    let camera = new THREE.PerspectiveCamera (
      45,
      this.$el.clientWidth / this.$el.clientHeight,
      1,
      1000
    );

    RENDERER.setSize (this.$el.clientWidth, this.$el.clientHeight);
    const canvasWrapper = this.$el;
    canvasWrapper.appendChild (RENDERER.domElement);

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

    const lightest = '337a99';
    const darkest = chroma(lightest).darken(3);
    const colorScale = chroma.scale([darkest, lightest]);
    RENDERER.setClearColor(chroma(lightest).darken(4).num(), 1);

    const gridUnitWithGutter = GRID_UNIT_LENGTH + GRID_GUTTER_SIZE;
    let sceneLength = gridUnitWithGutter * GRID_LENGTH;
    let sceneWidth = gridUnitWithGutter * GRID_WIDTH;
    let newHeight;
    let newBox;

    for (let i = 0; i < GRID_LENGTH; i++) {
      boxes[i] = [];

      for (let j = 0; j < GRID_WIDTH; j++) {
        newHeight = sample(utils.splitRough(33, 5, 3));
        gridBoxGeometry = new THREE.BoxBufferGeometry (
          GRID_UNIT_LENGTH,
          newHeight,
          GRID_UNIT_LENGTH,
        );
        gridBoxMaterial = new THREE.MeshLambertMaterial ({
          color: colorScale(sample([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])).hex(),
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
    const newCameraTarget = new THREE.Vector3(
      sceneLength / 2,
      0,
      sceneWidth / 2
    );

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN RENDER/UPDATE LOOPS

    // Update loop
    const cameraHeight = 18;
    const rotationPeriod = 32;
    const rotationRadius = 23;
    this.intervalId = window.setInterval (function () {
      const currentTime = Date.now () / 1000;
      const circCoords = utils.circleFunction(currentTime, rotationPeriod, rotationRadius);
      const cameraPos = new THREE.Vector3(
        circCoords.x + (sceneLength / 2),
        cameraHeight,
        circCoords.y + (sceneWidth / 2),
      );
      camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
      camera.lookAt(newCameraTarget);
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
