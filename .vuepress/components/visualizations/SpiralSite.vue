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
  name: 'SpiralSite',
  data: function () {
    return {
      intervalId: null,
    }
  },
  mounted() {
    ///////////////////////////////////////////////////////////////////////////////
    //   CONSTANTS

    const CAM_POS = new THREE.Vector3(80, 100, 80);
    const CAM_TARGET = new THREE.Vector3(0, 20, 0);
    const LIGHT_POS = new THREE.Vector3(1, 5, 1);
    const UPDATES_PER_SECOND = 20;
    const NUM_BOXES = 15;

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

    // PLANE
    const pGeometry = new THREE.PlaneBufferGeometry(100, 100);
    const pMaterial = new THREE.MeshBasicMaterial( {
      color: '#ff0000',
      side: THREE.DoubleSide,
    } );
    const plane = new THREE.Mesh( pGeometry, pMaterial );
    plane.rotateX(1.5708);
    scene.add(plane);

    // SPIRAL
    const boxes = [];
    const spiralPoints = utils.getPointsFromSpiral(NUM_BOXES, 20, 70);
    console.log('spiralPoints', spiralPoints);
    let newBox;
    let gridBoxGeometry;
    let gridBoxMaterial;
    for(let i = 0; i < NUM_BOXES; i++) {
      gridBoxGeometry = new THREE.BoxBufferGeometry (
        1,
        1,
        4,
      );
      gridBoxMaterial = new THREE.MeshLambertMaterial ({
        color: '#ff0000',
        flatShading: true,
      });
      newBox = new THREE.Mesh (gridBoxGeometry, gridBoxMaterial);
      newBox.position.set(
        spiralPoints[i].x,
        spiralPoints[i].z,
        spiralPoints[i].y,
      )
      boxes.push(newBox);
      scene.add(newBox);
    }

    boxes[0].lookAt(boxes[1].position);
    for(let i = 0; i < NUM_BOXES; i++) {
      if(i !== 0) {
        boxes[i].lookAt(boxes[i - 1].position);
      }
    }

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN RENDER/UPDATE LOOPS

    this.intervalId = window.setInterval (function () {
      const currentTime = Date.now () / 1000;
    }, 1000 / UPDATES_PER_SECOND);

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
  }
</style>
