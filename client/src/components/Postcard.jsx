import React from "react";
import { Card, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
const Postcard = ({
  post: { id, userName, body, createdAt, likeCount, commentCount }
}) => {
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
          basic
          label={{
            basic: true,
            color: "teal",
            pointing: "left",
            content: likeCount
          }}
        />
        <Button
          color="blue"
          icon="comments"
          basic
          label={{
            basic: true,
            color: "blue",
            pointing: "left",
            content: likeCount
          }}
        />
      </Card.Content>
    </Card>
  );
};

export default Postcard;
