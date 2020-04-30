import React from "react";
import {
  Button,
  Header,
  Modal,
  Form,
  TextArea,
  Comment
} from "semantic-ui-react";
import { CREATE_COMMENT, FETCH_POST } from "../utils/graphql";
import { useMutation } from "@apollo/react-hooks";
import moment from "moment";

const CommentsList = ({ comments }) => (
  <Comment.Group>
    {comments.map(comment => (
      <Comment>
        <Comment.Avatar
          as="a"
          src="https://react.semantic-ui.com/images/avatar/small/steve.jpg"
        />
        <Comment.Content>
          <Comment.Author as="a">{comment.userName}</Comment.Author>
          <Comment.Metadata>
            <div>{moment(comment.createdAt).fromNow()}</div>
          </Comment.Metadata>
          <Comment.Text>{comment.body}</Comment.Text>
        </Comment.Content>
      </Comment>
    ))}
  </Comment.Group>
);

const CommentModal = ({
  dimmer,
  setDimmer,
  postId,
  setCurrentComments,
  comments
}) => {
  const [open, setOpen] = React.useState(true);
  const [text, setText] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const close = () => {
    setOpen(false);
    setDimmer("");
  };
  const onChange = event => {
    setText(event.target.value);
  };

  const onSubmit = _ => {
    createCommentCallback();
    setCurrentComments(comments => comments + 1);
    close();
  };

  const [createComment] = useMutation(CREATE_COMMENT, {
    variables: { postId, body: text },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    refetchQueries: _ => [{ query: FETCH_POST }]
  });

  function createCommentCallback() {
    createComment();
  }

  return (
    <Modal dimmer={dimmer} open={open} onClose={close}>
      <Modal.Header>Add a comment</Modal.Header>
      <Modal.Content>
        {/* <Image
          wrapped
          size="medium"
          src="https://react.semantic-ui.com/images/avatar/large/rachel.png"
        /> */}
        <CommentsList comments={comments} />
        <Modal.Description>
          <Header>Write your comment here:</Header>
          <Form>
            <TextArea
              placeholder="Tell us more"
              style={{ width: "500px" }}
              value={text}
              onChange={onChange}
              error={errors}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={close}>
          Discard
        </Button>
        <Button
          color="teal"
          icon="checkmark"
          labelPosition="right"
          content="Submit"
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default CommentModal;
