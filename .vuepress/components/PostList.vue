<template>
  <div class="post-links" v-if="enabled">
    <div class="post-link-wrapper" v-for="post in posts">
      <div class="post-link">
        <a class="actual-plink" :href="getLinkHref(post)" :target="getLinkTarget(post)">
          <img class="post-link__img" :src="getThumbnailLink(post)" />
        </a>
        <div class="post-link__text">
          <a class="actual-plink" :href="getLinkHref(post)" :target="getLinkTarget(post)">
            <h2 class="post-link__title">{{ post.frontmatter.title }}</h2>
          </a>
          <span class="post-link__subtitle" v-if="post.frontmatter.subtitle">{{ post.frontmatter.subtitle }}</span>
          <span class="post-link__date">{{ getFormattedDate(post.frontmatter.date) }}</span>
          <p class="post-link__excerpt" v-if="post.frontmatter.type != 'link' && post.excerpt">{{ parseExcerptText(post.excerpt) }}</p>
        </div>
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
      margin-top: $space-unit * 2.5;
      flex: 0 0 100%;
    }

    .post-link {
      display: block;
      text-decoration: none;

      &__img {
        float: left;
        display: inline-block;
        width: 25%;
      }

      &__text {
        display: inline-block;
        width: 75%;
        padding-left: $space-unit * 0.66;
        margin-bottom: 0;
        line-height: 1.1;
      }

      &__title {
        margin-top: 0;
        margin-bottom: 6px;
        display: inline-block;
      }

      &__subtitle, &__date {
        @include subtitle-text;
        display: block;
        margin-bottom: 4px;
      }
    }
  }

  /* Larger than tablet */
  @media (min-width: 750px) {
    .post-links {
      .post-link-wrapper {
        flex: 0 0 calc(50% - 25px);
      }
      .post-link {
        display: block;
        text-decoration: none;

        &__img {
          width: 33%;
        }

        &__text {
          width: 67%;
        }
      }
    }
  }
</style>
