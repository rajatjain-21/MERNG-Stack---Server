import React from "react";
import { Grid } from "semantic-ui-react";
import Postcard from "./Postcard";
import { AuthContext } from "../context/auth";
import PostForm from "./PostForm";

const Posts = ({ posts }) => {
  const { user } = React.useContext(AuthContext);
  return (
    <Grid columns={3} divided>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {posts.map(post => (
          <Grid.Column
            key={post.id}
            style={{ marginBottom: 20, boxShadow: "none" }}
          >
            <Postcard post={post} />
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  );
};

export default Posts;
