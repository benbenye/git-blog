<template>
  <div class="editor">
    <marked-editor v-if="contents" :editor.sync="contents" :type="type"></marked-editor>
  </div>
</template>
<script>
import { graphQL } from "../utils/http-client";
import config from "../blog.config";
import MarkedEditor from "../components/marked-editor.vue";
import Data from "../store/data";
import querys from "../utils/querys";

export default {
  components: {
    MarkedEditor
  },
  data() {
    return {
      contents: null,
      type: "edit",
      title: this.$route.params.title
    };
  },
  created() {
    Data.path = this.$route.params.title;
  },
  mounted() {
    graphQL()
      .request(querys.getBlobContent, {
        name: `${config.branch}:${this.title}`
      })
      .then(data => {
        this.contents = data.repository.object;
        this.contents.title = this.title;
      });
  }
};
</script>
