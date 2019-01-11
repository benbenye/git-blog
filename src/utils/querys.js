import config from "../blog.config";
export default {
  getList: `{
  repository(owner:"${config.repositoryOwner}", name:"${
    config.repositoryName
  }") {
    defaultBranchRef {
      target {
        ... on Commit{
          tree {
            entries {
              name
              type
              mode
            }
          }
        }
      }
    }
  }
}`,
  getBlobContent: `
  query($name: String!){
  repository(owner:"${config.repositoryOwner}", name:"${
    config.repositoryName
  }") {
    object(expression:$name){
      ... on Blob{
        text
        id
        oid
        commitUrl
      }
    }
  }
}`
};
