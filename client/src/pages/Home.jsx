import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Posts from "../components/Posts";
import { Loader } from "semantic-ui-react";
import "../App.css";
const Home = () => {
  const { loading, data } = useQuery(FETCH_POST);
  if (loading) {
    return <Loader active inline="centered" />;
  }
  if (data && data.getPosts) {
    return <Posts posts={data.getPosts} />;
  }
  return null;
};

const FETCH_POST = gql`
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
export default Home;
