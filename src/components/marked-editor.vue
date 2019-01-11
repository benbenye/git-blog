<template>
  <div class="editor">
    <input class="header" type="text" v-model="title" placeholder="文章标题">

    <button v-if="type === 'edit'" class="update commit" @click="update">更新</button>
    <button v-else class="create commit" @click="create">新建</button>
    <div class="main" v-if="type === 'edit'">
      <textarea class="editor-input" v-model="input" @input="updateContent"></textarea>
      <div class="content-preview" v-html="compiledMarkdown"></div>
    </div>
    <div class="main" v-else>
      <textarea class="editor-input" v-model="createInput" @input="updateCreateContent"></textarea>
      <div class="content-preview" v-html="compiledMarkdown"></div>
    </div>
    <!--<textarea v-model="commitMes"></textarea>-->
  </div>
</template>

<script>
import marked from "marked";
import _ from "lodash";
import http from "../utils/http-client";
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
      title: this.filterUniqueId(this.type === "edit" ? this.editor.path : ""),
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
.editor {
  .commit {
    position: fixed;
    top: 10px;
    right: 30px;
    display: inline-block;
    text-align: center;
    width: 72px;
    line-height: 36px;
    background-color: #007fff;
    color: #ffffff;
    outline: none;
    border-radius: 4px;
  }
  .header {
    display: flex;
    font-weight: 700;
    font-size: 24px;
    align-items: center;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    padding: 0 16px;
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    z-index: 100;
  }
  .main {
    display: flex;
    position: absolute;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    .editor-input,
    .content-preview {
      flex: 1 1 50%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .editor-input {
      background-color: #f8f9fa;
    }
    .content-preview {
      position: relative;
      background-color: #fff;
      overflow: hidden;
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
  }
}
</style>
