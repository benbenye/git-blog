<template>
  <div class="comment">
    <div class="comment-list">
      <ul>
        <li v-for="(item, index) in comments" :key="index">
          <img :src="item.user.avatar_url" :alt="item.user.login">
          {{item.body}}
        </li>
      </ul>
    </div>
    <input type="text" v-model="commentToken" v-if="!localCommentToken">
    <textarea v-model="comment"></textarea>
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
      localCommentToken: "",
      comments: [],
      comment: ""
    };
  },
  mounted() {
    this.localCommentToken = this.commentToken = localStorage.getItem(
      "comment-token"
    );
    http(this.commentToken)
      .get(`${config.commentPath}/issues/${this.number}/comments`)
      .then(res => {
        this.comments = res.data;
      });
  },
  methods: {
    commit: function() {
      if (!this.commentToken) {
        alert("please input your token for add an issue");
        return;
      }
      http(this.commentToken)
        .post(`${config.commentPath}/issues/${this.number}/comments`, {
          body: this.comment
        })
        .then(() => {
          if (!Data.commentToken) {
            localStorage.setItem("comment-token", this.commentToken);
            Data.commentToken = this.localCommentToken = this.commentToken;
          }
          alert("commit success");
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
