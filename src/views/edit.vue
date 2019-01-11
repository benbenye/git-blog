<template>
  <div class="editor">
    <marked-editor v-if="contents" :editor.sync="contents" :type="type"></marked-editor>
  </div>
</template>
<script>
import http from "../utils/http-client";
import config from "../blog.config";
import MarkedEditor from "../components/marked-editor.vue";
import Data from "../store/data";

export default {
  components: {
    MarkedEditor
  },
  data() {
    return {
      contents: null,
      type: "edit"
    };
  },
  created() {
    Data.path = this.$route.path;
  },
  mounted() {
    http()
      .get(`${config.repoPath}/contents/${this.$route.params.path}`)
      .then(res => {
        if (res.status <= 299) {
          this.contents = res.data;
        }
      });
  }
};
</script>
