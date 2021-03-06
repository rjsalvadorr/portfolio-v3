<template>
  <div class="post-links" v-if="enabled">
    <div class="post-link-wrapper" v-for="post in posts">
      <div class="post-link">
        <a class="actual-plink" :href="getLinkHref(post)" :target="getLinkTarget(post)">
          <h2 class="post-link__title">{{ post.frontmatter.title }}</h2>
        </a>
        <span class="post-link__subtitle" v-if="post.frontmatter.subtitle">{{ post.frontmatter.subtitle }}</span>
        <span
          v-if="showDate(post)"
          class="post-link__date"
        >{{ getFormattedDate(post.frontmatter.date) }}</span>
        <a class="actual-plink" :href="getLinkHref(post)" :target="getLinkTarget(post)">
          <img class="post-link__img" :src="getThumbnailLink(post)" />
        </a>
      </div>
      <div class="post-link__text">
        <p class="post-link__excerpt" v-if="post.frontmatter.type != 'link' && post.excerpt">{{ parseExcerptText(post.excerpt) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";

export default {
  name: 'PostList',
  props: {
    enabled: Boolean,
    posts: Array,
  },
  methods: {
    getFormattedDate(rawDate) {
      const dt = DateTime.fromISO(rawDate).toUTC();
      return dt.toLocaleString(DateTime.DATE_MED);
    },
    parseExcerptText(excerptHtml) {
      /*
       * Parses relevant content from an expected input like so:
       * 
       * <h1 id="art-1"><a class="header-anchor" href="#art-1" aria-hidden="true">#</a>art-1</h1>
       * <p>Bacon ipsum dolor amet porchetta anim meatball aliquip</p>
      */
      const content = excerptHtml.split(/<\/?p>/);
      return content[content.length - 2];
    },
    getLinkHref(postData) {
      if (postData.frontmatter.type === "link") {
        return postData.frontmatter.target_url;
      } else {
        return postData.path;
      }
    },
    getLinkTarget: (postData) => {
      return postData.frontmatter.type === "link" ? '_blank' : '_self';
    },
    getThumbnailLink(postData) {
      const folderPath = postData.path.split('/').filter(token => token && token !== '');
      const folderName = folderPath[folderPath.length - 1];
      return `/images/thumbs/${folderName}.jpg`
    },
    showDate(postData) {
      if(postData.frontmatter.options && postData.frontmatter.options.includes('hideDate')) {
        return false;
      }
      return true;
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../styles/vars.scss";

  .post-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .post-link-wrapper {
      margin-top: $space-unit;
      margin-bottom: $space-unit;
      flex: 0 0 100%;
      width: 100%;
    }

    .post-link {
      display: block;
      text-decoration: none;

      a {
        display: block;
      }

      &__img {
        margin-top: $space-unit / 2;
        display: inline-block;
      }

      &__text {
        display: inline-block;
        margin-bottom: 0;
      }

      &__title {
        margin-top: 0;
        margin-bottom: 6px;
        line-height: 1.1;
        display: inline-block;
        letter-spacing: 0.08rem;
      }

      &__subtitle, &__date {
        @include subtitle-text;
        display: block;
        margin-bottom: 4px;
      }
    }
  }

  /* Larger than phablet */
  @media (min-width: 550px) {
    .post-links {
      .post-link-wrapper {
        flex: 0 0 calc(50% - 15px);
      }
      .post-link {
        display: block;
        text-decoration: none;
      }
    }
  }

  /* Larger than phablet */
  @media (min-width: 600px) {
    .post-link &__title {
      letter-spacing: 0.175rem;
    }
  }

  /* Larger than desktop */
  @media (min-width: 1000px) {
    .post-links {
      .post-link-wrapper {
        flex: 0 0 calc(50% - 20px);
        width: auto;
      }
    }
  }

  /* Larger than Desktop HD */
  @media (min-width: 1200px) {
    .post-links {
      .post-link-wrapper {
        flex: 0 0 calc(50% - 50px);
      }
    }
  }
</style>
