/**
 * Created by bby on 18/3/28.
 */
import axios from "axios";

export default function(token = localStorage.getItem("github-token")) {
  let headers = {
    Accept:
      "application/vnd.github.black-panther-preview+json application/vnd.github.symmetra-preview+json",
    "Content-type": "application/json"
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  return axios.create({
    baseURL: "https://api.github.com",
    headers: headers
  });
}
