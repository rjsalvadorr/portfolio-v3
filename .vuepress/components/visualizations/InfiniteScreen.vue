<template>
  <div class="canvas-wrapper">
  </div>
</template>

<script>
import * as THREE from 'three';
import sample from "lodash/sample";
import chroma from 'chroma-js';
import utils from '../../utils/three-utils';
import InfiniteBoxes from '../../utils/infinite-boxes';

export default {
  name: 'InfiniteScreen',
  data: function () {
    return {
      intervalId: null,
    }
  },
  mounted() {
    ///////////////////////////////////////////////////////////////////////////////
    //   CONSTANTS

    const CAM_POS = new THREE.Vector3(80, 120, 80);
    const CAM_TARGET = new THREE.Vector3(20, 0, 20);
    const LIGHT_POS = new THREE.Vector3(1, 5, 1);
    const UPDATES_PER_SECOND = 20;

    ///////////////////////////////////////////////////////////////////////////////
    //   THREE.JS ESSENTIALS

    let scene = new THREE.Scene ();
    let camera = new THREE.PerspectiveCamera (
      45,
      this.$el.clientWidth / this.$el.clientHeight,
      1,
      1000
    );
    camera.position.set(CAM_POS.x, CAM_POS.y, CAM_POS.z);
    camera.lookAt(CAM_TARGET);

    let renderer = new THREE.WebGLRenderer ({antialias: true});
    renderer.setSize (this.$el.clientWidth, this.$el.clientHeight);
    const canvasWrapper = this.$el;
    canvasWrapper.appendChild (renderer.domElement);

    let light = new THREE.DirectionalLight ('white', 0.8);
    light.position.set (LIGHT_POS.x, LIGHT_POS.y, LIGHT_POS.z);
    scene.add (light);

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN OBJECTS

    const lengthOptions = [100, 105, 110];
    const infBoxRow = [];
    const numBoxes = 6;
    const boxWidth = 20;
    const boxesGutter = 2;
    for (let i = 0; i < 2; i++) {
      infBoxRow.push(
        new InfiniteBoxes(
          sample(lengthOptions),
          numBoxes,
          boxWidth,
          i * (boxWidth + boxesGutter),
          false,
          boxesGutter,
        )
      );
    }
    console.log(infBoxRow);

    const meshes = [];
    let bGeometry;
    let bMaterial;
    let newBox;
    for (let boxes of infBoxRow) {
      for (let box of boxes.boxes) {
        bGeometry = new THREE.BoxBufferGeometry(box.length, 1, box.width);
        bMaterial = new THREE.MeshLambertMaterial({
          color: '#922438',
          flatShading: true,
        });
        newBox = new THREE.Mesh( bGeometry, bMaterial );
        newBox.position.set(box.x + (box.length / 2), 0, box.y);
        meshes.push(newBox);
        scene.add(newBox);
      }
    }
    console.log(meshes);


    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN RENDER/UPDATE LOOPS

    // this.intervalId = window.setInterval (function () {
    //   const currentTime = Date.now () / 1000;
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
    z-index: 10000;
  }
</style>
