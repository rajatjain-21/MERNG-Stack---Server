import gql from "graphql-tag";

export const FETCH_POST = gql`
  {
    getPosts {
      id
      createdAt
      userName
      body
      commentCount
      likeCount
      comments {
        userName
        body
        createdAt
      }
      likes {
        userName
      }
    }
  }
`;
