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
        id
        userName
        createdAt
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      userName
      createdAt
      body
      likeCount
      commentCount
      comments {
        id
        createdAt
        body
        userName
      }
      likes {
        id
        createdAt
        userName
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      id
      userName
      email
      createdAt
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register(
    $userName: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        userName: $userName
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      userName
      email
      createdAt
      token
    }
  }
`;

export const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      userName
      createdAt
    }
  }
`;
