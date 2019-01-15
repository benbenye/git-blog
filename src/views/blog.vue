<template>
  <div class="blog">
    <div class="post animated fadeInDown">
      <div class="post-title">
        <h3>{{contents && contents.path | filterTitle}}</h3>
      </div>
      <div class="post-content" v-html="html">
      </div>
      <div class="post-footer">
        <div class="meta">
          <div class="info">
            <i class="fa fa-sun-o"></i><span class="date">2016-12-26</span><i class="fa fa-tag"></i>
          </div>
        </div>
      </div>
    </div>
    <comment v-if="number" :number="number"></comment>
  </div>
</template>
<script>
import marked from "marked";
import http from "../utils/client-axios";
import { filterTitle } from "../utils";
import Comment from "../components/comment.vue";
import config from "../blog.config";
import Data from "../store/data";

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
  created() {
    Data.path = this.$route.path;
  },
  filters: {
    filterTitle
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
<style lang="scss" type="text/scss">
.blog {
  width: 780px;
}
.post {
  background-color: #fff;
  margin: 30px;
  .post-title {
    h3 {
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: 1;
      font-weight: 600;
      color: #464646;
      font-size: 22px;
      margin: 0;
    }
    a {
      text-decoration: none;
      letter-spacing: 1px;
      color: #5f5f5f;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .post-content {
    a {
      text-decoration: none;
      letter-spacing: 1px;
      color: #4786d6;
    }
    &:hover {
      color: #2f69b3;
    }
    h3 {
      color: #5f5f5f;
      font-size: 22px;
      font-weight: 600;
    }
  }
  .post-footer {
    padding: 0 0 30px 0;
    border-bottom: 1px solid #f2f2f2;
    .tags {
      padding-bottom: 15px;
      font-size: 13px;
      a {
        text-decoration: none;
        color: rgba(0, 0, 0, 0.44);
        font-weight: 400;
        &:hover {
          text-decoration: none;
        }
      }
      ul {
        list-style-type: none;
        display: inline;
        margin: 0;
        padding: 0;
        li {
          list-style-type: none;
          margin: 0;
          padding-right: 5px;
          display: inline;
        }
      }
    }
    .meta {
      max-width: 100%;
      height: 25px;
      color: #bbbbbb;
      i {
        margin-right: 6px;
      }
      .info {
        float: left;
        font-size: 12px;
        .date {
          margin-right: 10px;
        }
        a {
          text-decoration: none;
          color: #bbbbbb;
          padding-right: 10px;
          &:hover {
            color: #4786d6;
          }
        }
      }
    }
  }
}
</style>
