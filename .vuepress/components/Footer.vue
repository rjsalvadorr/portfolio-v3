<template>
  <div class="page-footer">
    <span class="copyright">© {{ getCurrentYear }} Randolph Jerome Salvador</span>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    getCurrentYear: () => {
      return new Date().getFullYear();
    }
  },
}
</script>

<style scoped lang="scss">
  @import "../styles/vars.scss";

  .page-footer {
    background-color: $footer-bg-color;
    background-image: url("/textures/shley-tree-1.png");

    color: $footer-color;
    padding: ($space-unit * 0.75) $space-unit;
    box-shadow: $box-shadow-up;

    .copyright {
      @include subtitle-text;
      letter-spacing: 0.09rem;
    }
  }
</style>
