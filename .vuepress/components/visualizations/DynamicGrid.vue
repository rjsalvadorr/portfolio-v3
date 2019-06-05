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
import { radialWave3 } from '../../utils/wave-utils';

export default {
  name: 'DynamicGrid',
  props: {
    renderer: Object,
  },
  data: function () {
    return {
      intervalId: null,
      unitSize: 64,
      grid: [],
    }
  },
  mounted() {
    const grid = new DynamicGrid(
      this.$el.clientWidth,
      this.$el.clientHeight,
      this.unitSize,
    );

    this.grid = grid;

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
    const updateFrequency = 20;
    this.intervalId = setInterval(() => {
      this.grid.applyFunc(this.updateGridUnit);
      this.grid.applyFunc(this.drawGridUnit);
    }, 1000 / updateFrequency);
  },
  methods: {
    updateGridUnit: function(gUnit) {
      const time = Date.now() / 1000;
      const waveCentre = {x: -1, y: 1};
      const adjustedCoords = {
        x: gUnit.x / this.$el.clientWidth,
        y: gUnit.y / this.$el.clientHeight,
      }
      const intensity = radialWave3(
        waveCentre,
        {x: adjustedCoords.x, y: adjustedCoords.y},
        time,
      );
      gUnit.intensity1 = intensity;
      gUnit.intensity2 = intensity;
    },
    drawGridUnit: function(gUnit) {
      const element = document.getElementsByClassName(`grid-unit--${gUnit.id}`)[0];
      element.style.top = `${gUnit.yCenter}px`;
      element.style.left = `${gUnit.xCenter}px`;
      element.style.opacity = gUnit.intensity1;

      const inner = element.children[0];
      const diameter = 48 * gUnit.intensity2;
      inner.style.height = `${diameter}px`;
      inner.style.width = `${diameter}px`;
      inner.style.borderRadius = `${diameter / 2}px`;
      inner.style.top = `-${diameter / 2}px`;
      inner.style.left = `-${diameter / 2}px`;
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

  .dynamic-grid-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 30;
    background-color: #4b0d00;

    .grid-unit {
      position: absolute;

      .inner {
        width: $display-size;
        height: $display-size;
        border-radius: $display-size / 2;
        background-color: #e12900;
        position: relative;
        top: -$display-size / 2;
        left: -$display-size / 2;
        z-index: 31;
      }
    }
  }
</style>
