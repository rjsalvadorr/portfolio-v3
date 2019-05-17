<template>
  <div :class="getThemeContainerClasses()" @keyup.esc="toggleDebugPanel()">
    <div class="theme-header">
      <Header :title="$site.title" :desc="getDescription()" :onHomePage="isHomePage()"></Header>
    </div>
    <div class="theme-content">
      <div class="content-wrapper-wrapper">
        <div :class="getContentClasses()">
          <slot>
            <!-- if <Layout> has children, they go here -->
          </slot>
          <h1 class="content-title">{{ $page.title }}</h1>
          <span
            class="content-date"
            v-if="isPost() && getPostDate()"
          >
            {{ getPostDate() }}
          </span>
          <Content :class="`content--${$page.frontmatter.type}`">
          </Content>
          <PostList :enabled="isCategoryPage()" :posts="filterPostsByCategory($site.pages, $page.frontmatter.category)"></PostList>
        </div>
        <Footer></Footer>
      </div>
    </div>
    <DebugPanel :enabled="debugPanelEnabled" :siteData="$site" :pageData="$page" ></DebugPanel>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import sample from "lodash/sample";
import filter from "lodash/filter";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import PostList from "../components/PostList.vue";
import ThreeCanvas from "../components/ThreeCanvas.vue";
import DebugPanel from "../components/DebugPanel.vue";

export default {
  name: 'Layout',
  data() {
    return {
      debugPanelEnabled: false,
    };
  },
  methods: {
    getContentClasses() {
      let classes = 'content-wrapper';
      if(this.$page.frontmatter.type) {
        classes += ` content-wrapper--${this.$page.frontmatter.type}`;
      }
      if(this.$page.frontmatter.classes) {
        for(let nextClass of this.$page.frontmatter.classes) {
          classes += ` content-wrapper--${nextClass}`;
        }
      }
      return classes;
    },
    getThemeContainerClasses() {
      let classes = 'theme-container';
      if(this.$page.frontmatter.type) {
        classes += ` theme-container--${this.$page.frontmatter.type}`;
      }
      return classes;
    },
    isHomePage() {
      return this.$page.frontmatter.type === 'home';
    },
    getDescription() {
      return sample(this.$site.description)
    },
    toggleDebugPanel() {
      this.debugPanelEnabled = !this.debugPanelEnabled;
    },
    isCategoryPage() {
      return this.$page.frontmatter.type === 'category';
    },
    isPost() {
      return this.$page.frontmatter.type === 'post';
    },
    getPostDate() {
      if(this.$page.frontmatter.date) {
        const dt = DateTime.fromISO(this.$page.frontmatter.date).toUTC();
        return dt.toLocaleString(DateTime.DATE_MED);
      }
      return '';
    },
    filterPostsByCategory(allPages, category) {
      // Filtering by category
      const filteredPosts = filter(allPages, (page) => {
        const isPost = page.frontmatter.type === "post";
        const isLink = page.frontmatter.type === "link";
        const isCorrectCategory = page.frontmatter.category === category;
        return (isPost || isLink) && isCorrectCategory;
      });

      // Sorting by reverse chronological order (newest first)
      return filteredPosts.sort((post1, post2) => {
        const dt1 = DateTime.fromISO(post1.frontmatter.date).toUTC();
        const dt2 = DateTime.fromISO(post2.frontmatter.date).toUTC();

        // post1 was written after post2
        if(dt1 > dt2) {
          return -1;
        } else if(dt1 < dt2) {
          return 1
        }
        // dt1 === dt2
        return 0;
      });
    },
  },
  components: {
    Header,
    Footer,
    PostList,
    ThreeCanvas,
    DebugPanel
  }
}
</script>

<style lang="scss">
  /////  GLOBAL STYLES
  @import "../styles/global.scss";
</style>

<style scoped lang="scss">
  /////  SCOPED NON-GLOBAL STYLES
  @import "../styles/vars.scss";

  .theme-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: $body-bg-color;
    color: $body-color;
    display: flex;
    flex-direction: column;

    .theme-content {
      overflow: auto;
      flex-grow: 1;
    }
  }
</style>
