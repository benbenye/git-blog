<template>
  <div class="blog">
    <div v-html="html"></div>
    <comment v-if="number" :number="number"></comment>
  </div>
</template>
<script>
import marked from "marked";
import http from "../utils/client-axios";
import Comment from "../components/comment.vue";
import config from "../blog.config";

export default {
  components: {
    Comment
  },
  data() {
    return {
      contents: null,
      html: "",
      number: 0
    };
  },
  mounted() {
    http()
      .get(`${config.repoPath}/contents/${this.$route.params.path}`)
      .then(res => {
        this.contents = res.data;
        this.html = marked(
          decodeURIComponent(escape(atob(this.contents.content))),
          { sanitize: true }
        );
        if (!config.isUseIssue) return;
        const result = this.$route.params.path.match(/\[(\d*)\]/);
        this.number = result && +result[1];
      });
  }
};
</script>
