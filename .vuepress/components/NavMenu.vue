<template>
  <nav class="page-nav">
    <div :class="`page-nav-wrapper page-nav-wrapper--${idx}`" v-for="(navLink, idx) in navigationLinks">
      <a class="page-nav-link"
      :href="navLink.link"
      :target="getLinkTarget(navLink)"
      rel="noreferrer"
      >{{ navLink.text }}</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavMenu',
  props: {
    navigationLinks: Array,
  },
  methods: {
    getLinkTarget: (link) => {
      return link.external ? '_blank' : '_self';
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../styles/vars.scss";

  .page-nav {
    display: flex;
    justify-content: flex-end;
    padding: 0 $space-unit / 1.75;

    &-wrapper {
      margin-top: 10px;
      padding: 0 ($space-unit / 2.5);
      flex: 0 0 auto;
      text-align: right;

      &--0 {
        margin-top: 0;
      }
    }

    &-link {
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      color: $header-link-color;
      font-weight: 700;

      &:hover,
      &:active {
        color: $header-link-color-hover;
      }
    }

    &.nav-wrapper--home {
      justify-content: space-around;
      
      .page-nav-wrapper {
        margin-top: 0;
      }
    }

    &.nav-wrapper--mobile {
      display: block;

      .page-nav-wrapper {
        text-align: left;
      }
    }
  }

  /* Larger than phablet */
  @media (min-width: 600px) {
    .page-nav-wrapper {
      justify-content: space-around;
      padding: 0 $space-unit * 0.75;
    }
  }
  
  @media (min-width: 750px) {
    .page-nav-wrapper {
      margin-top: 0;
    }
  }
</style>
