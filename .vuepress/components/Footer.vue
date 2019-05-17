<template>
  <div class="page-footer">
    <span class="contact contact-email">
      <img class="contact-icon" src="/icons/mail.svg" />
      randolph.salvador@gmail.com
    </span>
    <span class="contact contact-linkedin">
      <img class="contact-icon" src="/icons/linkedin.svg" />
      linkedin.com/in/randolphsalvador
    </span>
    <span class="contact contact-github">
      <img class="contact-icon" src="/icons/github.svg" />
      github.com/rjsalvadorr
    </span>
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

    .contact {
      // @include subtitle-text;
      letter-spacing: 0.05rem;
      font-size: $body-font-size * 0.8;
      line-height: $body-font-size * 1.2;
      display: block;

      &-icon {
        display: inline-block;
        height: $body-font-size * 0.95;
        width: $body-font-size * 0.95;
        margin-right: $body-font-size / 4;
        vertical-align: middle;
      }
    }

    .copyright {
      @include subtitle-text;
      letter-spacing: 0.09rem;
      display: block;
      margin-top: $space-unit * 0.75;
    }
  }
</style>
