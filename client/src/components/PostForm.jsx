import React from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../utils/hooks";
import { FETCH_POST, CREATE_POST } from "../utils/graphql";

const initialState = { body: "" };

const PostForm = props => {
  const [errors, setErrors] = React.useState({});
  const { onChange, onSubmit, values } = useForm(
    createPostCallback,
    initialState
  );
  const [createPost] = useMutation(CREATE_POST, {
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POST });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POST, data });
      values.body = "";
    },
    refetchQueries: _ => [{ query: FETCH_POST }],
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception);
      setErrors(err.graphQLErrors[0].extensions.exception);
    },
    variables: values
  });

  function createPostCallback() {
    createPost();
    setErrors({});
  }

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <h2>Create a post</h2>
        <Form.Input
          label="Post"
          name="body"
          type="text"
          error={errors.body}
          placeholder="Hello World!"
          value={values.body}
          onChange={onChange}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostForm;
