import React from "react";
import { Card, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { LIKE_POST } from "../utils/graphql";
import { AuthContext } from "../context/auth";

const Postcard = ({
  post: { id, userName, body, createdAt, likes, likeCount, commentCount }
}) => {
  const [currentLikes, setCurrentLikes] = React.useState(likeCount);
  const { user } = React.useContext(AuthContext);

  const isLiked = () => {
    if (!user) return false;
    const filteredLikes = likes.filter(like => like.userName === user.userName);
    return filteredLikes.length > 0;
  };
  const [hasUserLiked, setHasUserLiked] = React.useState(isLiked());

  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: id }
  });

  function likePostCallback() {
    setCurrentLikes(likes => (hasUserLiked ? likes - 1 : likes + 1));
    setHasUserLiked(hasUserLiked => !hasUserLiked);
    likePost();
  }
  return (
    <Card fluid>
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
            content: commentCount
          }}
        />
      </Card.Content>
    </Card>
  );
};

export default Postcard;
