<template>
  <div class="visualizations">
    <div :class="`visuals-overlay ${getFadeClass()}`">
    </div>
    <div class="visuals-wrapper">
      <div v-if="currentVisual === 1" class="visual visual-1">
        <SpiralSite></SpiralSite>
      </div>
      <div v-if="currentVisual === 2" class="visual visual-2">
        <GreyWaterfall lightestCol="191925" darkestCol="08080c"></GreyWaterfall>
      </div>
      <div v-if="currentVisual === 3" class="visual visual-3">
        <SpiralSite></SpiralSite>
      </div>
    </div>
  </div>
</template>

<script>
import ThreeCity from "./visualizations/ThreeCity.vue";
import GreyWaterfall from "./visualizations/GreyWaterfall.vue";
import SpiralSite from "./visualizations/SpiralSite.vue";

export default {
  name: 'Visualizations',
  data: function () {
    return {
      currentVisual: 1,
      maxVisuals: 3,
      visualDuration: 10,
      overlayEnabled: true,
      intervalId: null,
    }
  },
  mounted() {
    const fadeOut = () => {
      this.overlayEnabled = true;
    }

    const fadeIn = () => {
      this.overlayEnabled = false;
    }

    const setFades = () => {
      fadeIn();
      window.setTimeout(fadeOut, (this.visualDuration - 0.6) * 1000);
    }

    const next = () => {
      this.goToNextVisual();
      setFades();
    }

    setFades();
    this.intervalId = window.setInterval (next, 1000 * this.visualDuration);
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
    }
  },
  components: {
    ThreeCity,
    GreyWaterfall,
    SpiralSite,
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
    opacity: 0.25;
    transition: opacity 0.6s linear;
  }

  .visuals-overlay--opaque {
    opacity: 1;
  }
</style>