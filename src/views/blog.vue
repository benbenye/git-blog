<template>
  <div class="blog">
    <div v-html="html"></div>
    <comment :number="number"></comment>
  </div>
</template>
<script>
import marked from "marked";
import http from "../utils/client-axios";
import Comment from "../components/comment.vue";
import config from "../config";

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
        const result = this.$route.params.path.match(/\[issue-(\d*)\]/);
        this.number = result && +result[1];
        //          如果没有拿到number
      });
  }
};
</script>
