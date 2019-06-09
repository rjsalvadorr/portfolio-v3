<template>
  <div class="broken-grid-wrapper">
    <div v-for="(box, boxIndex) in circleGrid"
      v-bind:key="`${boxIndex}`"
      :class="`box box--${box.id}`"
    ></div>
  </div>
</template>

<script>
import sample from "lodash/sample";
import shuffle from "lodash/shuffle";
import chroma from 'chroma-js';
import BrokenGrid from '../../utils/broken-grid';
import utils from '../../utils/three-utils';
import { getDistFromPoints, radialWave3 } from '../../utils/wave-utils';

export default {
  name: 'BrokenGrid',
  props: {
    renderer: Object,
  },
  data: function () {
    return {
      intervalId: null,
      unitSize: 64,
      mainBox: {},
      grid: {},
    }
  },
  mounted() {
    const initFunc = this.initializeGrid;
    initFunc();

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
    const subsetIdx = Math.ceil(this.circleGrid.length * 0.25);
    const subsetIdx2 = this.circleGrid.length - Math.ceil(this.circleGrid.length * 0.25);
    const subset = this.circleGrid.slice(0, subsetIdx);
    const subset2 = this.circleGrid.slice(subsetIdx2, this.circleGrid.length);

    for(let box of subset) {
      box.intensity1 = box.intensity1 * 0.7;
      box.intensity2 = 1;
    }

    for(let box of subset2) {
      box.intensity1 = box.intensity1 * 0.5;
      box.intensity2 = 2;
    }

    for(let box of this.circleGrid) {
      this.updateBox(box);
      this.drawBox(box);
    }

    const updateFrequency = 20;
    this.intervalId = setInterval(() => {
      for(let box of this.circleGrid) {
        const intensity = radialWave3(
          {x: 0, y: 0},
          {x: box.x, y: box.y},
          Date.now() / 1100,
        );
        const avgIntensity = (box.intensity1 + (intensity * 0.6)) / 2;
        box.intensity3 = avgIntensity;
        this.updateBox(box);
        this.drawBox(box);
      }
    }, 1000 / updateFrequency);
  },
  computed: {
    circleGrid: function() {
      let filteredBoxes = [];
      if(this.grid && this.grid.filterBoxes) {
        const radialOrigin = {
          x: this.mainBox.w / 2,
          y: this.mainBox.h / 2
        };
        const portrait = this.mainBox.h > this.mainBox.w;
        let longSide, shortSide;
        if(portrait) {
          longSide = this.mainBox.h;
          shortSide = this.mainBox.w;
        } else {
          longSide = this.mainBox.w;
          shortSide = this.mainBox.h;
        }
        const maxDist = (longSide / 2) * 0.9;

        const intensityAdj = box => {
          const boxCenter = {
            x: box.x + box.w / 2,
            y: box.y + box.h / 2
          };
          const dist = getDistFromPoints(radialOrigin, boxCenter);
          let intensityRes = 1 - dist / maxDist;
          if (intensityRes < 0) {
            intensityRes = 0;
          }
          box.intensity1 = intensityRes;
        };

        const radialFilter = box => {
          const boxCenter = {
            x: box.x + box.w / 2,
            y: box.y + box.h / 2
          };
          const dist = getDistFromPoints(radialOrigin, boxCenter);
          return dist <= maxDist;
        };

        filteredBoxes = this.grid.filterBoxes(radialFilter, intensityAdj);
      }
      return filteredBoxes;
    },
  },
  methods: {
    initializeGrid: function() {
      const BOX_GUTTER = 12;
      this.mainBox = {
        x: 0,
        y: 0,
        w: this.$el.clientWidth,
        h: this.$el.clientHeight,
      };

      const rGrid = new BrokenGrid(
        this.mainBox.x,
        this.mainBox.y,
        this.mainBox.w,
        this.mainBox.h,
        this.mainBox.w * this.mainBox.h / 250,
        BOX_GUTTER,
      );

      this.grid = rGrid;
    },
    updateBox: function(gUnit) {
      //
    },
    drawBox: function(gUnit) {
      const element = document.getElementsByClassName(`box--${gUnit.id}`)[0];
      if(element) {
        element.style.left = `${gUnit.x}px`;
        element.style.top = `${gUnit.y}px`;
        element.style.width = `${gUnit.w}px`;
        element.style.height = `${gUnit.h}px`;
        element.style.opacity = gUnit.intensity3;

        if(gUnit.intensity2 === 1) {
          element.style.backgroundColor = '#2B4162';
        }
        if(gUnit.intensity2 === 2) {
          element.style.backgroundColor = '#FA9F42';
          // element.style.backgroundColor = '#0B6E4F';
        }
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
    background-color: #080808;
    // transform: rotate(10deg); /* Equal to rotateZ(45deg) */

    .box {
      position: absolute;
      background-color: #800;
    }
  }
</style>
