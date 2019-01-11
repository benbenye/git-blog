/**
 * Created by bby on 18/4/12.
 */
import http from "./http-client";
import config from "../blog.config";
import Data from "../store/data";
export default http().get(`${config.repoPath}`);

export const login = function() {
  const obj = {
    testToken: function(token) {
      this.testAdminToken()
        .then(res => {
          if (res === "ok") {
            this.setToken("admin", token);
            return "ok.";
          } else {
            alert("sorry, you haven't access to this blog");
            return this.testGuestToken();
          }
        })
        .then(() => {
          this.setToken("guest", token);
          alert("ok.");
        })
        .catch(() => {
          alert("Please rewrite your token.");
        });
    },
    setToken: function(flag, token) {
      Data.token = this.token;
      localStorage.setItem("github-token", `${flag} ${token}`);
    },
    testGuestToken: function() {
      http()
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
    testAdminToken: function() {
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
  };
  return obj.testToken;
};