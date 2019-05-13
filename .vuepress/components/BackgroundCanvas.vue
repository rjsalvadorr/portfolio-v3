<template>
  <div class="canvas-wrapper">
  </div>
</template>

<script>
export default {
  name: 'BackgroundCanvas',
  mounted() {
    window.addEventListener('resize', this.resizeHandler);

    console.log(this.$el);
    console.log(this.$el.clientHeight);
    console.log(this.$el.clientWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    resizeHandler(evt) {
      console.log('resizing!', evt);
    }
  }
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
  }
</style>
