<template>
  <div class="dynamic-grid-wrapper">
    <div v-for="(row, rowIndex) in grid.grid"
      v-bind:key="`${rowIndex}`"
      :class="`grid-row grid-row--${rowIndex}`"
    >
      <td v-for="(unit, index) in row"
        v-bind:key="unit.id"
        :class="`grid-unit grid-unit--${unit.id}`"
        :data-id="unit.id"
      >
        <div class="inner"></div>
      </td>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import sample from "lodash/sample";
import chroma from 'chroma-js';
import DynamicGrid from '../../utils/dynamic-grid';
import utils from '../../utils/three-utils';

export default {
  name: 'DynamicGrid',
  props: {
    renderer: Object,
  },
  data: function () {
    return {
      intervalId: null,
      grid: [],
    }
  },
  mounted() {
    const setRandomIntensity = (gUnit) => {
      gUnit.intensity1 = Math.random();
      gUnit.intensity2 = Math.random();
    }

    const unitSize = 48;
    const grid = new DynamicGrid(
      this.$el.clientWidth,
      this.$el.clientHeight,
      unitSize,
    );

    this.grid = grid
    this.grid.applyFunc(setRandomIntensity);

///////////////////////////////////////////////////////////////////////////////
    //   HANDLING WINDOW RESIZES
    const canvasElement = this.$el;
    function resizeGrid(evt) {
      console.log('resizing....');
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
    this.grid.applyFunc(this.updateGridUnit);
  },
  methods: {
    updateGridUnit: function(gUnit) {
      const element = document.getElementsByClassName(`grid-unit--${gUnit.id}`)[0];
      element.style.top = `${gUnit.y}px`;
      element.style.left = `${gUnit.x}px`;
      element.style.opacity = gUnit.intensity1;
    }
  },
  beforeDestroy() {
    window.clearInterval(this.intervalId);
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/vars.scss";
  $unit-size: 48px;

  .dynamic-grid-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    .grid-unit {
      position: absolute;
      width: $unit-size;
      height: $unit-size;
      background-color: #F00;
    }
  }
</style>
