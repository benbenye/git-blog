/**
 * Created by bby on 18/4/12.
 */
import http, { Request } from "./client-axios";
import config from "../blog.config";
import Data from "../store/data";

const obj = {
  testToken: function(token) {
    this.testAdminToken(token)
      .then(res => {
        if (res === "ok") {
          Data.userType = "admin";
          this.setToken(token);
          return "ok.";
        } else {
          return this.testGuestToken(token);
        }
      })
      .then(res => {
        if (res === "ok") {
          this.setToken(token);
          return;
        } else if (res === "ok.") return;
        throw false;
      })
      .catch(() => {
        alert("Please rewrite your token.");
      });
  },
  setToken: function(token) {
    Data.token = token;
    localStorage.setItem("github-token", `${token}`);
  },
  testGuestToken: function(token) {
    return Request(token)
      .post(`${config.commentPath}/issues/1/comments`, {
        body: "test for guest token."
      })
      .then(() => {
        return "ok";
      })
      .catch(() => {
        return false;
      });
  },
  testAdminToken: function(token) {
    return http()
      .get(`${config.repoPath}/contents/test-token`)
      .then(res => {
        return Request(token).put(`${config.repoPath}/contents/test-token`, {
          message: "test token",
          sha: res.data.sha,
          content: ""
        });
      })
      .then(() => {
        return "ok";
      })
      .catch(() => {
        return false;
      });
  }
};
export default Request().get(`${config.repoPath}`);

export function login(token) {
  obj.testToken(token);
}

export function filterTitle(str) {
  return str && str.replace(/(\[\d*\])/, "");
}
