<template>
  <div class="comment">

    <input type="text" v-model="commentToken" v-if="!localCommentToken">
    <button @click="commit">提交</button>
  </div>
</template>

<script>
import Data from "../store/data";
import http from "../utils/client-axios";
import config from "../blog.config";

export default {
  name: "comment",
  components: {},
  props: {
    number: {
      type: Number,
      required: true
    }
  },
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
        .post(`${config.commentPath}/issues/${this.number}/comments`, {
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
