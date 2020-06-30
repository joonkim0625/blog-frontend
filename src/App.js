import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import NavbarComponent from "./components/layout/NavbarComponent";
import Home from "./components/layout/Home";
import PostsList from "./components/posts/PostsList";
import PostDetail from "./components/posts/PostDetail";
import AddPost from "./components/posts/AddPost";
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import SearchResult from "./components/layout/SearchResult";
import AuthContextProvider from "../src/contexts/AuthContext";
import AuthContext from "./contexts/AuthContext";
import MyPost from "./components/layout/MyPost";

function App() {
  const authContext = useContext(AuthContext);
  return (
    <AuthContextProvider>
      <Router>
        <NavbarComponent />
        <div className="container mt-3">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/posts" component={PostsList} />
            <Route exact path="/myposts" component={MyPost} />
            <Route path="/mypost/:id" component={PostDetail} />
            <Route path="/post/:id" component={PostDetail} />
            <Route path="/addmypost" component={AddPost} />
            <Route path="/addpost" component={AddPost} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path={"/searchResults"} component={SearchResult} />
          </Switch>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
