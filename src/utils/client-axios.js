/**
 * Created by bby on 18/3/28.
 */
import axios from "axios";
import config from "../blog.config";

export default function() {
  let headers = {
    Accept:
      "application/vnd.github.black-panther-preview+json application/vnd.github.symmetra-preview+json",
    "Content-type": "application/json",
    Authorization: `token ${config.adminToken.join("")}`
  };
  return axios.create({
    baseURL: "https://api.github.com",
    headers: headers
  });
}

export const Request = function(token) {
  let headers = {
    Accept:
      "application/vnd.github.black-panther-preview+json application/vnd.github.symmetra-preview+json",
    "Content-type": "application/json",
    Authorization: `token ${token}`
  };
  return axios.create({
    baseURL: "https://api.github.com",
    headers: headers
  });
};
