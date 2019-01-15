import Vue from "vue";
import Router from "vue-router";
import Home from "./views/home.vue";
import Edit from "./views/edit.vue";
import Blog from "./views/blog.vue";
import NewBlog from "./views/new-blog.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/edit/:title",
      name: "edit",
      component: Edit
    },
    {
      path: "/blog/:title",
      name: "blog",
      component: Blog
    },
    {
      path: "/new-blog",
      name: "new-blog",
      component: NewBlog
    },
    {
      path: "/about",
      name: "about",
      component: NewBlog
    },
    {
      path: "/contents",
      name: "contents",
      component: NewBlog
    }
  ]
});
