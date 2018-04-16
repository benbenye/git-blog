<template>
  <div class="comment">
    <div class="comment-title">评论</div>
    <div class="comment-form">
      <textarea class="content-input" v-model="comment" placeholder="说说你的看法"></textarea>
      <button @click="commit" class="submit-btn">提交</button>
    </div>
    <div class="comment-list">
      <ul>
        <li class="item" v-for="(item, index) in comments" :key="index">
          <div class="comment-content">
            <div class="user-popover-box">
              <a :href="item.user.html_url" target=" blank" rel="">
                <div class="avatar" :title="item.user.login"
                     :style="'background-image: url('+item.user.avatar_url+');'"></div>
              </a>
            </div>
            <div class="content-box">
              <div class="header">
                <div class="user-info">
                  <div class="user-popover-box">
                    <a :href="item.user.html_url" target="_blank" rel="" class="username">{{item.user.login}}</a>
                  </div>
                  <!--<div class="position">前端工程师</div>-->
                </div>
              </div>
              <div class="content">
                <span class="content-html">{{item.body}}</span>
              </div>
              <div class="footer">
                <span class="sub-comment-btn text-pointer">
                    <span class="title">评论</span>
                  </span>
                <span class="date">{{item.created_at}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
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
      comments: [],
      comment: ""
    };
  },
  mounted() {
    http()
      .get(`${config.commentPath}/issues/${this.number}/comments`)
      .then(res => {
        this.comments = res.data;
      });
  },
  methods: {
    commit: function() {
      http()
        .post(`${config.commentPath}/issues/${this.number}/comments`, {
          body: this.comment
        })
        .then(() => {
          alert("commit success");
          window.location.reload();
        })
        .catch(() => {
          alert("Your token illegal");
        });
    }
  }
};
</script>

<style scoped lang="scss" type="text/scss">
.comment {
  margin: 30px;
  padding: 24px;
  .comment-form {
    padding-bottom: 36px;
    .token-input {
      margin-bottom: 12px;
    }
    .content-input {
      height: 60px;
      word-wrap: break-word;
      line-height: 1.9rem;
      margin-bottom: 12px;
    }
    .submit-btn {
      width: 72px;
      height: 36px;
      background-color: #007fff;
      color: #ffffff;
      float: right;
      outline: none;
      border-radius: 4px;
    }
  }
  .comment-title {
    margin-bottom: 1.3rem;
    font-size: 1.3rem;
    font-weight: 500;
    text-align: center;
    color: #909090;
  }
  .comment-list {
    .item {
      position: relative;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
      &:not(:last-of-type):not(.highlight):before {
        content: "";
        position: absolute;
        left: 3.5rem;
        bottom: 0;
        right: 0;
        border-bottom: 1px solid #f5f5f5;
      }
      .comment-content {
        position: relative;
        overflow: hidden;
        .avatar {
          position: absolute;
          top: 0;
          left: 0;
          width: 2.7rem;
          height: 2.7rem;
          cursor: pointer;
          border-radius: 50%;
          background-size: contain;
        }
      }
      .content-box {
        margin: 0.5rem 0 0 3.5rem;

        .user-info {
          display: flex;
          -webkit-box-align: baseline;
          -ms-flex-align: baseline;
          align-items: baseline;
          flex-wrap: wrap;
          .username {
            font-weight: 600;
            color: #333;
            margin-right: 0.6rem;
            .position {
              font-size: 1rem;
              color: #909090;
              max-width: 220px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        .content {
          margin: 0.3rem 0 0.5rem;
          line-height: 1.7;
          color: #333;
          .content-html {
            margin-right: 0.5em;
            white-space: pre-wrap;
            .show-all {
              color: #6799cd;
              white-space: nowrap;
              cursor: pointer;
              .username {
                color: #007fff;
              }
            }
          }
        }

        .footer {
          display: flex;
          align-items: baseline;
          color: #909090;
          .sub-comment-btn {
            position: relative;
            margin-right: 15px;
            font-size: 20px;
            height: 30px;
            color: #909090;
            user-select: none;
            .title {
              font-size: 13px;
            }
            &:before {
              content: "";
              display: inline-block;
              width: 16px;
              height: 16px;
              background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzLjEgKDM5MDEyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5PdmFsIDI8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgICAgICA8ZyBpZD0iV2ViX+ayuOeCueivpuaDhemhtV/lsZXlvIDor4TorroiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zODQuMDAwMDAwLCAtNTg2LjAwMDAwMCkiIHN0cm9rZT0iIzkwOTA5MCI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC05IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODQuMDAwMDAwLCA1ODUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOCwxNS41MTg1MTg1IEMxMS44NjU5OTMyLDE1LjUxODUxODUgMTUsMTIuNzE2MTUyNyAxNSw5LjI1OTI1OTI2IEMxNSw1LjgwMjM2NTgzIDExLjg2NTk5MzIsMyA4LDMgQzQuMTM0MDA2NzUsMyAxLDUuODAyMzY1ODMgMSw5LjI1OTI1OTI2IEMxLDEwLjYyMjc3NTggMS40ODc1ODMyNiwxMS44ODQ0NjIxIDIuMzE1MzQ4OTQsMTIuOTEyNTE1MyBDMi40MzYzOTI3OCwxMy4wNjI4NDcxIDEuOTMzMzMzMzMsMTYgMS45MzMzMzMzMywxNiBDMS45MzMzMzMzMywxNiA0Ljk4MDgwMzYsMTQuOTA3OTg0NyA0Ljk4MDgwMzYsMTQuOTA3OTg0NyBDNS45MTE4NTcyOSwxNS4yNjMyNzkyIDYuOTE4ODQxMDQsMTUuNTE4NTE4NSA4LDE1LjUxODUxODUgWiIgaWQ9Ik92YWwtMiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
              background-repeat: no-repeat;
              background-position: 50%;
              background-size: contain;
              margin-right: 5px;
              vertical-align: middle;
            }
            .sub-comment--arrow {
              position: absolute;
              top: 100%;
              left: 0;
              width: 100%;
              &:before {
                content: "";
                position: absolute;
                left: 30px;
                border-width: 0 9px 10px;
                border-style: solid;
                border-color: transparent transparent #eaeaea;
                top: 100%;
              }
              &:after {
                content: "";
                position: absolute;
                top: calc(100% + 2px);
                left: 31px;
                border-width: 0 8px 8px;
                border-style: solid;
                border-color: transparent transparent #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
