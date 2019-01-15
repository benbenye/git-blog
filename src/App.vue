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
      <input type="text" placeholder="请填写您的 github token" v-model="token">
      <button class="btn" @click="login(token)">登录</button>
    </div>
    <router-link to="/new-blog" v-if="Data.token && Data.path === '/'" class="new-btn">新建博客</router-link>
    <router-view/>
  </div>
</template>

<script>
import Data from "./store/data";
import { login } from "./utils/index";
import blogConfig from "./blog.config";

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
    if (localStorage.getItem("github-token")) {
      Data.token = this.token = localStorage.getItem("github-token");
      if (this.token === blogConfig.token.join("")) Data.userType = "admin";
      login();
    }
  },
  methods: {
    login: login
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
