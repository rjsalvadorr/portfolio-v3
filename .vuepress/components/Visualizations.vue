<template>
  <div class="visualizations">
    <div :class="`visuals-overlay ${getFadeClass()}`">
    </div>
    <div class="visuals-wrapper">
      <div v-if="currentVisual === 1" class="visual visual-1">
        <ThreeCity :renderer="renderer"></ThreeCity>
      </div>
      <div v-if="currentVisual === 2" class="visual visual-2">
        <VanishingCircles :renderer="renderer"></VanishingCircles>
      </div>
      <div v-if="currentVisual === 3" class="visual visual-3">
        <InfiniteScreen :renderer="renderer"></InfiniteScreen>
      </div>
      <div v-if="currentVisual === 4" class="visual visual-4">
        <DynamicGrid></DynamicGrid>
      </div>
    </div>
  </div>
</template>

<script>
import { WebGLRenderer } from 'three';
import InfiniteScreen from "./visualizations/InfiniteScreen.vue";
import ThreeCity from "./visualizations/ThreeCity.vue";
import GridWaterfall from "./visualizations/GridWaterfall.vue";
import VanishingCircles from "./visualizations/VanishingCircles.vue";
import DynamicGrid from "./visualizations/DynamicGrid.vue";
import utils from '../utils/three-utils';

export default {
  name: 'Visualizations',
  data: function () {
    return {
      currentVisual: 1,
      maxVisuals: 4,
      visualDuration: 7,
      overlayEnabled: true,
      intervalId: null,
      renderer: null,
    }
  },
  beforeMount() {
    this.renderer = new WebGLRenderer ({antialias: true});
  },
  mounted() {
    const fadeIn = () => {
      this.overlayEnabled = false;
    }

    fadeIn();
    this.setRandomVisual();

    // Temporary setting, for dev'ing
    this.currentVisual = 4;
  },
  methods: {
    getFadeClass() {
      return this.overlayEnabled ? 'visuals-overlay--opaque' : '';
    },
    goToNextVisual() {
      if(this.maxVisuals === this.currentVisual) {
        this.currentVisual = 1;
      } else {
        this.currentVisual = this.currentVisual + 1;
      }
    },
    setRandomVisual() {
      this.currentVisual = utils.getRandomInt(1, this.maxVisuals);
    }
  },
  components: {
    InfiniteScreen,
    ThreeCity,
    GridWaterfall,
    VanishingCircles,
    DynamicGrid,
  },
  beforeDestroy() {
    window.clearInterval(this.intervalId);
  }
}
</script>

<style scoped lang="scss">
  @import "../styles/vars.scss";

  .visualizations {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10
  }

  .visuals-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 40;
    background-color: #000000;
    opacity: 0.2;
    transition: opacity 0.6s linear;
  }

  .visuals-overlay--opaque {
    opacity: 1;
  }
</style>
