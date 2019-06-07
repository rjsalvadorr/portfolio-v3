<template>
  <div class="broken-grid-wrapper">
    <div v-for="(box, boxIndex) in grid.boxes"
      v-bind:key="`${boxIndex}`"
      :class="`box box--${box.id}`"
    ></div>
  </div>
</template>

<script>
import sample from "lodash/sample";
import chroma from 'chroma-js';
import BrokenGrid from '../../utils/broken-grid';
import utils from '../../utils/three-utils';

export default {
  name: 'BrokenGrid',
  props: {
    renderer: Object,
  },
  data: function () {
    return {
      intervalId: null,
      unitSize: 64,
      grid: {},
    }
  },
  mounted() {
    const initFunc = this.initializeGrid;
    initFunc();
    console.log(this.grid)

    ///////////////////////////////////////////////////////////////////////////////
    //   HANDLING WINDOW RESIZES

    function resizeGrid(evt) {
      initFunc();
    };

    const resizeHandler = evt => {
      resizeGrid(evt);
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
  updated() {
    // const updateFrequency = 20;
    // this.intervalId = setInterval(() => {
    //   this.grid.applyFunc(this.updateBox);
    //   this.grid.applyFunc(this.drawBox);
    // }, 1000 / updateFrequency);
    
    this.grid.applyFunc(this.updateBox);
    this.grid.applyFunc(this.drawBox);
  },
  methods: {
    initializeGrid: function() {
      const BOX_GUTTER = 10;
      const MAIN_BOX = {
        x: 0,
        y: 0,
        w: this.$el.clientWidth,
        h: this.$el.clientHeight,
      };

      const rGrid = new BrokenGrid(
        MAIN_BOX.x,
        MAIN_BOX.y,
        MAIN_BOX.w,
        MAIN_BOX.h,
        MAIN_BOX.w * MAIN_BOX.h / 100,
        BOX_GUTTER,
      );

      this.grid = rGrid;
    },
    updateBox: function(gUnit) {
      //
    },
    drawBox: function(gUnit) {
      const element = document.getElementsByClassName(`box--${gUnit.id}`)[0];
      console.log(element);
      if(element) {
        element.style.left = `${gUnit.x}px`;
        element.style.top = `${gUnit.y}px`;
        element.style.width = `${gUnit.w}px`;
        element.style.height = `${gUnit.h}px`;
        element.style.opacity = gUnit.intensity1;
      }
    }
  },
  beforeDestroy() {
    window.clearInterval(this.intervalId);
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/vars.scss";
  $unit-size: 64px;
  $display-size: 48px;

  .broken-grid-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 30;
    background-color: #3c0a00;

    .box {
      position: absolute;
      background-color: #900;
    }
  }
</style>
