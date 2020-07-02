import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import SearchBar from "./SearchBar";

const NavbarComponent = () => {
  const { dispatch, data } = useContext(AuthContext);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {" "}
            <Nav.Link as={Link} to="/myposts">
              My Post
            </Nav.Link>
            <Nav.Link as={Link} to="/posts">
              Forum
            </Nav.Link>
            {data.isAuthenticated ? (
              <Nav.Link
                as={Link}
                to="/"
                onClick={() => {
                  dispatch({
                    type: "LOGOUT",
                    state: {
                      isAuthenticated: false,
                      userData: {},
                    },
                  });
                }}
              >
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                {" "}
                Login
              </Nav.Link>
            )}
          </Nav>
          <SearchBar />
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}; // NavbarComponent.js

export default NavbarComponent;
