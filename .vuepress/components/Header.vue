<template>
  <div :class="getHeaderClass()">
    <div v-if="!onHomePage">
      <div class="header-top">
        <div class="header-wrapper">
          <a href="/"><h1 class="page-title">{{ title }}</h1></a>
          <span class="page-desc">{{ desc}}</span>
        </div>
        <NavMenu class="nav-wrapper nav-wrapper--desktop" :navigationLinks="$site.themeConfig.nav"></NavMenu>
        <div class="btn-mobile-burger" v-on:click="toggleMobileMenu">
          <BurgerIcon :class="getButtonClass()" />
        </div>
      </div>
      <div class="header--mobile" v-if="mobileMenuOpen">
        <NavMenu class="nav-wrapper nav-wrapper--mobile" :navigationLinks="$site.themeConfig.nav"></NavMenu>
      </div>
    </div>
    <div v-else>
      <div class="header-top header-top--home">
        <NavMenu class="nav-wrapper nav-wrapper--home" :navigationLinks="$site.themeConfig.nav.slice(0, -1)"></NavMenu>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import NavMenu from "./NavMenu.vue";
import BurgerIcon from "./BurgerIcon.vue";

export default {
  name: 'Header',
  data: function () {
    return {
      mobileMenuOpen: false,
      throttledResize: function() {},
    }
  },
  props: {
    title: String,
    desc: String,
    onHomePage: Boolean,
  },
  components: {
    NavMenu,
    BurgerIcon,
  },
  methods: {
    getHeaderClass() {
      let headerClass = 'page-header';
      if(this.mobileMenuOpen) {
        headerClass += ' page-header--mobile-expanded';
      }
      if(this.onHomePage) {
        headerClass += ' page-header--home';
      }
      return headerClass;
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    getButtonClass() {
      const iconModifier = this.mobileMenuOpen ? 'open' : 'closed';
      return `mobile-burger-icon mobile-burger-icon--${iconModifier}`;
    },
    onResize(event) {
      const viewportWidth = event.target.innerWidth;
      if(viewportWidth >= 750) {
        this.mobileMenuOpen = false;
      }
    }
  },
  mounted() {
    // Register an event listener when the Vue component is ready
    this.throttledResize = throttle(this.onResize, 150, { leading: true });
    window.addEventListener('resize', this.throttledResize);
  },
  beforeDestroy() {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener('resize', this.throttledResize);
  }
}
</script>

<style scoped lang="scss">
  @import "../styles/vars.scss";

  $title-height: 40px;
  $title-height-mobile: 30px;

  $burger-width: 40px;
  $burger-height: 40px;
  $burger-width-mobile: 30px;
  $burger-height-mobile: 30px;

  $nav-mobile-offset: -130px;

  .page-header {
    color: $header-color;
    position: relative;
    z-index: $z-index-header;
    box-shadow: $box-shadow-down;
    height: $header-height-mob;

    &--mobile-expanded .header-top {
      height: $header-height-mob-exp;
    }

    &--home {
      height: $header-height-phone-home;
      position: absolute;
      left: 0;
      right: 0;
      box-shadow: none;
    }

    .header-top {
      z-index: $z-index-header - 2;
      display: flex;

      padding: $space-unit;
      background-color: $header-bg-color;
      background-image: url("/images/textures/shley-tree-1.png");

      &--home {
        padding-left: 0;
        padding-right: 0;

        // position: absolute;
        // left: 0;
        // right: 0;
        background: none;

        .nav-wrapper.nav-wrapper--home {
          padding-left: 0;
          padding-right: 0;
          margin-top: 0;
        }
      }

      .page-title {
        margin-top: 0;
        letter-spacing: 0.1rem;
        display: inline-block;
        margin-bottom: 0;
        font-size: $title-height-mobile;
        line-height: $title-height-mobile;
        color: $header-link-color;

        &:hover {
          color: $header-link-color-hover;
        }
      }

      .page-desc {
        @include subtitle-text;
        display: block;
        font-weight: 300;
        letter-spacing: 0.12rem;
      }

      .header-wrapper {
        flex: 1 1 50%;
      }

      .nav-wrapper {
        flex: 2 1 50%;
        margin-top: $space-unit - 5px;
      }
    }

    .header--mobile {
      display: block;
      position: absolute;
      z-index: $z-index-header - 1;
      left: 0;
      right: 0;
      bottom: $nav-mobile-offset;
      padding-bottom: $space-unit * 0.75;
      box-shadow: $box-shadow-down;
    }
    .nav-wrapper--desktop {
      display: none;
    }
    .btn-mobile-burger {
      display: block;
    }
    .mobile-burger-icon {
      width: $burger-width-mobile;
      height: $burger-height-mobile;
      fill: $header-color;
      filter: drop-shadow(2px 3px 2px rgba(0, 0, 0, 0.4)); 

      &--open {
        fill: darken($header-color, 5%);
        opacity: 0.5;
        filter: none;
      }
    }
  }

  /* Larger than tablet */
  @media (min-width: 600px) {
    .page-header {
      &--mobile-expanded .header-top {
        height: $header-height-mob-exp + 10px;
      }
      .header--mobile {
        bottom: $nav-mobile-offset - 10px;
      }
    }
  }

  /* Larger than tablet */
  @media (min-width: 750px) {
    .header-top {
      .page-title {
        @include display-text;
        font-size: $title-height !important;
        line-height: $title-height !important;
      }

      .mobile-burger-icon {
        width: $burger-width;
        height: $burger-height;
      }
    }

    .page-header {
      height: auto;

      .header--mobile {
        display: none;
      }
      .nav-wrapper--desktop {
        display: flex;
      }
      .btn-mobile-burger {
        display: none;
      }
    }
  }
</style>
