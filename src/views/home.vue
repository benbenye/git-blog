<template>
  <div class="home">
    <div class="post animated fadeInDown"
         v-for="(item, index) in files" v-if="item.type === 'file'" :key="index">
      <div class="post-title">
        <h3>
          <router-link :to="{name:'blog', params: {path: item.path}}">{{item.name}}</router-link>
          <template v-if="Data.token">
            <router-link :to="{name:'edit', params: {path: item.path}}"> [修改]</router-link>
            <span class="delete" @click="cut(item)">[删除]</span>
          </template>
        </h3>
      </div>
      <div class="post-content">
        <p>This is a image test post.</p>
      </div>
      <div class="post-footer">
        <div class="meta">
          <div class="info">
            <i class="fa fa-sun-o"></i><span class="date">2016-12-26</span><i class="fa fa-tag"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Data from "../store/data";
import http from "../utils/client-axios";
import config from "../blog.config";

export default {
  name: "home",
  components: {},
  data() {
    return {
      files: [],
      Data: Data
    };
  },
  created() {
    Data.path = this.$route.path;
  },
  mounted() {
    http()
      .get(`${config.repoPath}/contents`)
      .then(res => {
        if (res.status <= 299) {
          this.files = res.data;
        }
      });
  },
  methods: {
    getFileContents: function(path) {
      return http().get(`${config.repoPath}/contents/${path}`);
    },
    cut: function(file) {
      http()
        .delete(
          `${config.repoPath}/contents/${file.path}?message=delete&sha=${
            file.sha
          }`
        )
        .then(() => {
          alert("delete success");
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" type="text/scss">
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
