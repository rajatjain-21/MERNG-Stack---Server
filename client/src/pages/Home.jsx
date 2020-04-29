import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Posts from "../components/Posts";
import { Loader } from "semantic-ui-react";
import { FETCH_POST } from "../utils/graphql";

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

export default Home;
