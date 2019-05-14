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
    ///////////////////////////////////////////////////////////////////////////////

    const SHOW_AXIS_LINES = false;
    const SHOW_CAMERA_TARGET = true;
    const CAMERA_TARGET = new THREE.Vector3(-30, 10, 0);
    const STAR_RADIUS = 30;
    const UPDATES_PER_SECOND = 24;

    ///////////////////////////////////////////////////////////////////////////////
    //   THREE.JS ESSENTIALS
    ///////////////////////////////////////////////////////////////////////////////

    let scene = new THREE.Scene ();
    let camera = new THREE.PerspectiveCamera (
      45,
      this.$el.clientWidth / this.$el.clientHeight,
      1,
      1000
    );
    camera.position.set (STAR_RADIUS * 1.5, STAR_RADIUS * -0.5, STAR_RADIUS * 1.5);
    camera.lookAt (CAMERA_TARGET);

    let renderer = new THREE.WebGLRenderer ({antialias: true});
    renderer.setSize (this.$el.clientWidth, this.$el.clientHeight);
    const canvasWrapper = this.$el;
    canvasWrapper.appendChild (renderer.domElement);

    let light = new THREE.DirectionalLight ('white', 0.8);
    light.position.set (2, 3, 0);
    scene.add (light);

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN OBJECTS
    ///////////////////////////////////////////////////////////////////////////////

    // Creating stars
    const globeGeometry = new THREE.IcosahedronGeometry (STAR_RADIUS, 1);

    const starGroup = new THREE.Group ();
    const starGeometry = new THREE.SphereGeometry (0.9);
    const starMaterial = new THREE.LineBasicMaterial ({
      color: 0xdd0000,
      lights: false,
    });
    let newStar;
    let starCoords;
    for (let starPos of globeGeometry.vertices) {
      newStar = new THREE.Mesh (starGeometry, starMaterial);

      newStar.position.setX (starPos.x);
      newStar.position.setY (starPos.y);
      newStar.position.setZ (starPos.z);

      starGroup.add (newStar);
    }
    scene.add (starGroup);

    ///////////////////////////////////////////////////////////////////////////////
    //   MAIN RENDER/UPDATE LOOPS
    ///////////////////////////////////////////////////////////////////////////////

    // Update loop
    let startTime = Date.now () / 1000;
    window.setInterval (function () {
      const currentTime = Date.now () / 1000;

      // Rotate star globe
      starGroup.rotateY (Math.PI / 180);
      starGroup.rotateZ (Math.PI / 360);
    }, 1000 / UPDATES_PER_SECOND);

    // Render loop
    let render = function () {
      requestAnimationFrame (render);
      renderer.render (scene, camera);
    };

    render ();

    ///////////////////////////////////////////////////////////////////////////////
    //   HANDLING WINDOW RESIZES
    ///////////////////////////////////////////////////////////////////////////////

    function resizeRenderer() {
      camera.aspect = this.$el.clientWidth / this.$el.clientHeight;
      renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
      camera.updateProjectionMatrix();
    };

    const resizeHandler = evt => {
      resizeRenderer();
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
