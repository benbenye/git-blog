<template>
  <div class="comment">
    <input type="text" v-model="commentToken" v-if="!localCommentToken">
    <button @click="commit">提交</button>
  </div>
</template>

<script>
import Data from "../store/data";
import http from "../utils/client-axios";
import config from "../config";

export default {
  name: "comment",
  components: {},
  data() {
    return {
      commentToken: "",
      localCommentToken: ""
    };
  },
  mounted() {
    this.localCommentToken = this.commentToken = localStorage.getItem(
      "comment-token"
    );
  },
  methods: {
    commit: function() {
      if (!this.commentToken) {
        alert("please input your token for add an issue");
        return;
      }
      http(this.commentToken)
        .post(`${config.repoPath}/issues`, {
          title: "Found a bug",
          body: "I'm having a problem with this."
        })
        .then(() => {
          if (!Data.commentToken) {
            localStorage.setItem("comment-token", this.commentToken);
            Data.commentToken = this.localCommentToken = this.commentToken;
          }
        })
        .catch(() => {
          alert("Your token illegal");
        });
    }
  }
};
</script>

<style scoped lang="sass" type="text/sass">
</style>
