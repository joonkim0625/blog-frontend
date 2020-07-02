import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory, Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  const { dispatch } = useContext(AuthContext);
  let history = useHistory();

  const usernameRef = useRef();
  const passwordRef = useRef();

  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateInput = () => {
    const fields = [
      {
        name: "username",
        value: state.username,
        message: "Please enter your username!",
      },
      {
        name: "password",
        value: state.password,
        message: "Please enter your password!",
      },
    ];
    const isNotFilled = fields.some((field) => {
      if (field.value.trim() === "") {
        setErrorMsg(field.message);
        field.name === "email"
          ? usernameRef.current.focus()
          : passwordRef.current.focus();
        return true;
      }
      setErrorMsg("");
      return false;
    });
    return isNotFilled;
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const isInvalid = validateInput();
    if (!isInvalid) {
      AuthService.login(state.username, state.password).then(
        (res) => {
          dispatch({
            type: "LOGIN",
            isAuthenticated: true,
            payload: res,
          });

          if (props.location.state) {
            history.push(props.location.state.from);
          } else {
            history.push("/");
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setSuccessMsg("");
      setLoading(false);
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        {successMsg && <p className="successMsg">{successMsg}</p>}
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        {}
        <Form onSubmit={handleOnSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              ref={usernameRef}
              value={state.username}
              placeholder="Enter your username"
              autoComplete="off"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              ref={passwordRef}
              value={state.password}
              placeholder="Enter your password"
              autoComplete="off"
              onChange={handleInputChange}
            />
          </Form.Group>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
        <hr />
        <p>Not registered yet?</p>
        <Link
          to={{
            pathname: "/register",
            state: {
              from: props.location.state ? props.location.state.from : "",
            },
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
