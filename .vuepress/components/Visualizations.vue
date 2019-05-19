<template>
  <div class="visualizations">
    <div :class="`visuals-overlay ${getFadeClass()}`">
    </div>
    <div class="visuals-wrapper">
      <div v-if="currentVisual === 1" class="visual visual-1">
        <ThreeCanvas></ThreeCanvas>
      </div>
      <div v-if="currentVisual === 2" class="visual visual-2">
        <h2>VISUAL 2 COMIN AT YA</h2>
      </div>
      <div v-if="currentVisual === 3" class="visual visual-3">
        <h2>THIRD VISUAL WHOA</h2>
      </div>
    </div>
  </div>
</template>

<script>
import ThreeCanvas from "./ThreeCanvas.vue";

export default {
  name: 'Visualizations',
  data: function () {
    return {
      currentVisual: 3,
      maxVisuals: 3,
      visualDuration: 10,
      overlayEnabled: true,
    }
  },
  mounted() {
    const fadeOut = () => {
      this.overlayEnabled = true;
    }

    const fadeIn = () => {
      this.overlayEnabled = false;
    }

    const next = () => {
      this.goToNextVisual();
      fadeIn();
      window.setTimeout(fadeOut, (this.visualDuration - 0.5) * 1000);
    }

    next();
    window.setInterval (next, 1000 * this.visualDuration);
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
  }

  .visuals-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: #000000;
    opacity: 0.1;
    transition: opacity 0.5s linear;
  }

  .visuals-overlay--opaque {
    opacity: 1;
  }
</style>
