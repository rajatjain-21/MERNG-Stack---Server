import React from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";
const initialState = {
  userName: "",
  password: ""
};
const Login = props => {
  const [errors, setErrors] = React.useState({});
  const context = React.useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(
    loginUserCallback,
    initialState
  );
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(
      _,
      {
        data: { login: userData }
      }
    ) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          name="userName"
          type="text"
          error={errors.userName}
          placeholder="Enter Name"
          value={values.userName}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          name="password"
          type="password"
          error={errors.password}
          placeholder="Enter Password"
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" color="teal">
          Login
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

const LOGIN_USER = gql`
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
export default Login;
