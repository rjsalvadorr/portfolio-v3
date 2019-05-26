<template>
  <div class="page-footer">
    <span class="contact contact-email">
      <img class="contact-icon" src="/images/icons/mail.svg" />
      randolph.salvador@gmail.com
    </span>
    <span class="contact contact-linkedin">
      <img class="contact-icon" src="/images/icons/linkedin.svg" />
      <a href="https://www.linkedin.com/in/randolphsalvador/" target="_blank">
        linkedin.com/in/randolphsalvador
      </a>
    </span>
    <span class="contact contact-github">
      <img class="contact-icon" src="/images/icons/github.svg" />
      <a href="https://github.com/rjsalvadorr" target="_blank">
        github.com/rjsalvadorr
      </a>
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
    background-image: url("/images/textures/shley-tree-1.png");

    color: $footer-color;
    padding: ($space-unit * 0.75) $space-unit;
    box-shadow: $box-shadow-up;

    .contact {
      letter-spacing: 0.05rem;
      font-size: $body-font-size * 0.8;
      line-height: $body-font-size * 1.2;
      display: block;

      a {
        font-size: inherit;
        line-height: inherit;
        color: inherit;

        &:hover {
          color: darken($footer-color, 30%);
        }
      }

      &-icon {
        margin-right: $body-font-size / 4;
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
