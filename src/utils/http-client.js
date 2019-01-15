/**
 * Created by bby on 18/3/28.
 */
import config from "../blog.config";
import axios from "axios";
import { GraphQLClient } from "graphql-request";

export default function(token = localStorage.getItem("github-token")) {
  let headers = {
    Accept:
      "application/vnd.github.black-panther-preview+json application/vnd.github.symmetra-preview+json",
    "Content-type": "application/json"
  };
  if (token) {
    headers.Authorization = `token ${token.split(" ")[1]}`;
  }
  return axios.create({
    baseURL: config.baseURL,
    headers: headers
  });
}

export const graphQL = function(token = localStorage.getItem("github-token")) {
  let headers = { Authorization: `token ${config.token.join("")}` };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  const client = new GraphQLClient(config.endpoint, { headers: headers });
  return client;
};

export const graphQLForIssue = function(
  token = localStorage.getItem("github-token")
) {
  // eslint-disable-next-line no-undef
  const env = process.env;
  let headers = { Authorization: `token ${config.token.join("")}` };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  if (env.VUE_APP_ISSUE_PREVIEW) {
    headers.Accept = env.VUE_APP_ISSUE_PREVIEW;
  }
  const client = new GraphQLClient(config.endpoint, { headers: headers });
  return client;
};
