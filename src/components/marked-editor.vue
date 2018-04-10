<template>
  <div id="editor">
    <template v-if="type === 'edit'">
      <textarea v-model="input" @input="updateContent"></textarea>
      <div v-html="compiledMarkdown"></div>
      <input type="text" v-model="title" placeholder="文章标题">
      <div id="update" @click="update">更新</div>
    </template>
    <template v-else>
      <textarea v-model="createInput" @input="updateCreateContent"></textarea>
      <div v-html="compiledMarkdown"></div>
      <input type="text" v-model="title" placeholder="文章标题">
      <div id="create" @click="create">新建</div>
    </template>
    <textarea v-model="commitMes"></textarea>
  </div>
</template>

<script>
import marked from "marked";
import _ from "lodash";
import http from "../utils/client-axios";
import config from "../blog.config";

export default {
  name: "MarkedEditor",
  props: {
    editor: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true //edit|create
    }
  },
  data() {
    return {
      input:
        this.type === "edit" &&
        decodeURIComponent(escape(atob(this.editor.content))),
      createInput: "",
      title: this.filterUniqueId(
        this.type === "edit" ? this.editor.path : "unnamed.md"
      ),
      commitMes: "commit",
      uniqueTitle: ""
    };
  },
  computed: {
    compiledMarkdown: function() {
      if (this.type === "create") return "";

      return marked(this.input, { sanitize: true });
    }
  },
  methods: {
    updateContent: _.debounce(function(e) {
      this.input = e.target.value;
    }, 300),
    updateCreateContent: _.debounce(function(e) {
      this.createInput = e.target.value;
    }, 300),
    update: function() {
      if (
        this.editor.path ===
        `[${this.editor.path.match(/\[(\d*)\]/)[1]}]${this.title}`
      ) {
        http().put(`${config.repoPath}/contents/${this.editor.path}`, {
          message: this.commitMes,
          sha: this.editor.sha,
          content: btoa(unescape(encodeURIComponent(this.input)))
        });
      } else {
        this.create().then(() => {
          http().delete(
            `${config.repoPath}/contents/${
              this.editor.path
            }?message=delete&sha=${this.editor.sha}`
          );
        });
      }
    },
    create: function() {
      if (config.isUseIssue) {
        if (this.type === "edit") {
          this.uniqueTitle = `[${this.editor.path.match(/\[(\d*)\]/)[1]}]${
            this.title
          }`;
          return http()
            .put(`${config.repoPath}/contents/${this.uniqueTitle}`, {
              message: this.commitMes,
              content: btoa(unescape(encodeURIComponent(this.input)))
            })
            .then()
            .catch(() => {});
        }
        return http()
          .post(`${config.commentPath}/issues`, {
            title: this.title,
            body: "https://benbenye.github.io"
          })
          .then(res => {
            this.uniqueTitle = `[${res.data.number}]${this.title}`;
            return http().put(
              `${config.repoPath}/contents/${this.uniqueTitle}`,
              {
                message: this.commitMes,
                content: btoa(unescape(encodeURIComponent(this.createInput)))
              }
            );
          })
          .catch(() => {});
      } else {
        let title = "";
        if (this.type === "edit") {
          title = `[${this.editor.path.match(/\[(\d*)\]/)[1]}]${this.title}`;
        } else {
          title = this.title;
        }
        return http()
          .put(`${config.repoPath}/contents/${title}`, {
            message: this.commitMes,
            content: btoa(unescape(encodeURIComponent(this.createInput)))
          })
          .then()
          .catch(() => {});
      }
    },
    filterUniqueId: function(str) {
      return str.match(/\[\d*\]/) ? str.replace(/(\[\d*\])/, "") : str;
    }
  }
};
</script>

<style lang="scss" type="text/scss">
#editor {
  margin: 0;
  height: 100%;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
}

textarea,
#editor div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}
</style>
