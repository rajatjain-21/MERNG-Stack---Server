import React from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";
const initialState = {
  userName: "",
  password: "",
  confirmPassword: "",
  email: ""
};
const Register = props => {
  const [errors, setErrors] = React.useState({});
  const context = React.useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(addUserCallback, initialState);
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(
      _,
      {
        data: { register: userData }
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

  function addUserCallback() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
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
          label="Email"
          name="email"
          type="email"
          error={errors.email}
          placeholder="Enter email id"
          value={values.email}
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
        <Form.Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          error={errors.confirmPassword}
          placeholder="Confirm Password"
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Button type="submit" color="teal">
          Sign up
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

const REGISTER_USER = gql`
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
export default Register;
