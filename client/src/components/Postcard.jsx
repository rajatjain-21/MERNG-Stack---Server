import React from "react";
import { Card, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { LIKE_POST, DELETE_POST, FETCH_POST } from "../utils/graphql";
import { AuthContext } from "../context/auth";
import CommentModal from "./Comment";
import "../App.css";

const Postcard = ({
  post: {
    id,
    userName,
    body,
    createdAt,
    likes,
    likeCount,
    comments,
    commentCount
  }
}) => {
  const [currentLikes, setCurrentLikes] = React.useState(likeCount);
  const [currentComments, setCurrentComments] = React.useState(commentCount);
  const { user } = React.useContext(AuthContext);
  const [dimmer, setDimmer] = React.useState("");

  const isLiked = () => {
    if (!user) return false;
    const filteredLikes = likes.filter(like => like.userName === user.userName);
    return filteredLikes.length > 0;
  };
  const [hasUserLiked, setHasUserLiked] = React.useState(isLiked());

  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: id }
  });

  const [deletePost] = useMutation(DELETE_POST, {
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POST });
      data.getPosts = data.getPosts.filter(post => post.id === id);
      proxy.writeQuery({ query: FETCH_POST, data });
    },
    refetchQueries: _ => [{ query: FETCH_POST }],
    variables: { postId: id }
  });

  const commentClickHandler = () => {
    setDimmer("blurring");
  };

  function likePostCallback() {
    setCurrentLikes(likes => (hasUserLiked ? likes - 1 : likes + 1));
    setHasUserLiked(hasUserLiked => !hasUserLiked);
    likePost();
  }
  function deletePostCallback() {
    deletePost();
  }
  return (
    <div>
      <Card fluid className="zoom">
        <Card.Content>
          <Image
            floated="right"
            size="mini"
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
          />
          <Card.Header>{userName}</Card.Header>
          <Card.Meta as={Link} to={`posts/${id}`}>
            {moment(createdAt).fromNow(true)}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button
            color="teal"
            icon="heart"
            basic={!hasUserLiked}
            label={{
              basic: true,
              color: "teal",
              pointing: "left",
              content: currentLikes
            }}
            onClick={user && likePostCallback}
          />
          <Button
            color="blue"
            icon="comments"
            basic
            label={{
              basic: true,
              color: "blue",
              pointing: "left",
              content: currentComments
            }}
            onClick={user && commentClickHandler}
          />
          {user && user.userName === userName && (
            <Button
              color="red"
              icon="trash alternate"
              basic
              floated="right"
              onClick={deletePostCallback}
            />
          )}
        </Card.Content>
      </Card>
      {dimmer === "blurring" && (
        <CommentModal
          dimmer={dimmer}
          setDimmer={setDimmer}
          postId={id}
          setCurrentComments={setCurrentComments}
          comments={comments}
        />
      )}
    </div>
  );
};

export default Postcard;
