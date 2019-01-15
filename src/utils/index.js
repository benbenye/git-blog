/**
 * Created by bby on 18/4/12.
 */
import http from "./http-client";
import config from "../blog.config";
import Data from "../store/data";
export default http().get(`${config.repoPath}`);

export const login = function(token) {
  Data.token = token;
  localStorage.setItem("github-token", `${token}`);
  if (token === config.token.join("")) {
    Data.userType = "admin";
  }
};
