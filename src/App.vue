<template>
  <div id="app">
    <nav :class="{active: Data.path === '/'}">
      <li>
        <router-link to="/">首页</router-link>
      </li>
      <li>
        <router-link to="/about">关于</router-link>
      </li>
      <li>
        <router-link to="/contents">归档</router-link>
      </li>
    </nav>
    <div class="token" v-if="!Data.token">
      <input type="text" placeholder="请填写您的 github token，已确认您的身份" v-model="token">
      <button class="btn" @click="setToken">提交</button>
    </div>
    <router-link to="/new-blog" v-if="Data.token && Data.path === '/'" class="new-btn">新建博客</router-link>
    <router-view/>
  </div>
</template>

<script>
import Data from "./store/data";
import http from "./utils/client-axios";
import config from "./blog.config";

export default {
  name: "App",
  data() {
    return {
      token: Data.token,
      Data: Data
    };
  },
  created() {
    Data.path = this.$route.path;
  },
  mounted() {
    Data.token = this.token = localStorage.getItem("github-token");
  },
  methods: {
    setToken: function() {
      this.testToken().then(res => {
        if (res === "ok") {
          Data.token = this.token;
          localStorage.setItem("github-token", this.token);
          alert("token is ok");
        } else {
          alert("sorry, you haven't access to this blog");
        }
      });
    },
    testToken: function() {
      return http()
        .get(`${config.repoPath}/contents/test-token`)
        .then(res => {
          return http(this.token).put(
            `${config.repoPath}/contents/test-token`,
            {
              message: "test token",
              sha: res.data.sha,
              content: ""
            }
          );
        })
        .then(() => {
          return "ok";
        })
        .catch(() => {
          return false;
        });
    }
  }
};
</script>

<style lang="scss" type="text/scss">
@import "./common/scss/base";
#app {
  &.active {
    position: fixed;
  }
  nav {
    padding: 18px 30px;
    display: inline-block;
    li {
      position: relative;
      display: initial;
      padding-right: 20px;
      a {
        color: #5a5a5a;
        &:hover {
          color: #4786d6;
        }
        &.current {
          color: #5a5a5a;
          padding-bottom: 22px;
          border-bottom: 1px solid #5a5a5a;
        }
      }
    }
  }
  .token {
    display: inline-block;
    input {
      width: 260px;
      margin-right: 20px;
    }
    .btn {
      width: 72px;
      height: 36px;
      background-color: #007fff;
      color: #ffffff;
      float: right;
      outline: none;
      border-radius: 4px;
    }
  }
  .new-btn {
    display: inline-block;
    text-align: center;
    width: 72px;
    line-height: 36px;
    background-color: #007fff;
    color: #ffffff;
    outline: none;
    border-radius: 4px;
  }
}
</style>
