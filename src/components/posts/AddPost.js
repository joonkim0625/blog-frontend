import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import PostDataService from "../../services/PostService";
import { AuthContext } from "../../contexts/AuthContext";

// text editor
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

// styles
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

const getHtml = (editorState) =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

// AddPost.js
const AddPost = (props) => {
  const { data: userInfo } = useContext(AuthContext);

  let history = useHistory();
  const initialPostState = {
    postId: null,
    userId: null,
    author: null,
    title: "",
    body: "",
    boardType: "",
  };

  const titleRef = useRef();

  const [post, setPost] = useState(initialPostState);
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [validated, setValidated] = useState(false);
  const [boardType, setBoardType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    // if there is already a post(if the same postId exists already),
    // it means it is going to be edited so load the previous post

    const boardType = props.match.path === "/addpost" ? "post" : "mypost";
    setBoardType(boardType);

    if (props.location.state) {
      const getPost = (postId) => {
        PostDataService.get(postId)
          .then((res) => {
            setPost({
              postId: res.data.id,
              userId: res.data.userId,
              author: res.data.author,
              title: res.data.title,
              body: res.data.body,
              boardType: res.data.boardType,
            });
            const blocksFromHTML = htmlToDraft(res.data.body);

            const state = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            setEditorState(EditorState.createWithContent(state));
          })
          .catch((e) => {
            console.log(e);
          });
      };
      getPost(props.location.state.postId);
      setEditMode(true);
      titleRef.current.focus();
    } else {
    }
  }, [props.location.state]);

  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  function uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
      xhr.open("POST", "https://api.imgur.com/3/image");
      xhr.setRequestHeader("Authorization", "Client-ID c4c2facaaa48ba4");
      const data = new FormData(); // eslint-disable-line no-undef
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPost({ ...post, [name]: value });
  }; // handleInputChange

  const handleSubmit = (e) => {
    e.preventDefault();

    const isInvalid = validateInput();
    if (!isInvalid) {
      if (editMode) {
        updatePost();
        setValidated(true);
      } else {
        savePost();
        setValidated(true);
      }
    }
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
  };

  const updatePost = () => {
    const convertedBody = getHtml(editorState);

    const data = {
      title: post.title,
      body: convertedBody,
    };

    PostDataService.update(post.postId, data)
      .then((res) => {
        setSubmitted(true);

        history.push(`${boardType}/${post.postId}`);
      })
      .catch((e) => {
        console.log(e);
      });
  }; // updatePost

  // create a new post data
  const savePost = () => {
    const convertedBody = getHtml(editorState);

    const data = {
      userId: userInfo.data.id,
      author: userInfo.data.username,
      title: post.title,
      body: convertedBody,
      boardType: boardType,
    };

    PostDataService.create(data)
      .then((res) => {
        setSubmitted(true);
        history.push(`${boardType}/${res.data.id}`);
      })
      .catch((e) => {
        console.log(e);
      });
  }; // savePost

  const validateInput = () => {
    const fields = [
      {
        name: "title",
        value: post.title,
        message: "Title cannot be empty!",
      },
    ];

    const isNotFilled = fields.some((field) => {
      if (field.value.trim() === "") {
        setErrorMsg(field.message);
        titleRef.current.focus();
        return true;
      }
      setErrorMsg("");
      return false;
    });

    return isNotFilled;
  };

  return userInfo.isAuthenticated ? (
    <>
      <Form onSubmit={handleSubmit} validated={validated} noValidate>
        <Form.Group controlId="validationTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            className="form-control"
            required
            placeholder="Enter a title"
            value={post.title}
            onChange={handleInputChange}
            name="title"
            ref={titleRef}
          />
          {errorMsg && <Alert variant={"danger"}>{errorMsg}</Alert>}
        </Form.Group>

        <Form.Group controlId="validationBody">
          <Form.Label>Contents</Form.Label>

          <Editor
            editorStyle={{
              minHeight: 376,
              border: "1px solid #F1F1F1",
              padding: 5,
              borderRadius: 2,
              height: "auto",
            }}
            toolbar={{
              image: {
                urlEnabled: true,
                uploadEnabled: true,
                alignmentEnabled: true,
                uploadCallback: uploadImageCallBack,
                previewImage: true,
                inputAccept: "image/*",
                alt: { present: true, mandatory: false },
                defaultSize: {
                  height: "400",
                  width: "auto",
                },
              },
            }}
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="editer-content"
            onEditorStateChange={handleEditorStateChange}
          />

          <Form.Control.Feedback type="invalid">
            Please write something!
          </Form.Control.Feedback>
        </Form.Group>

        {editMode ? (
          <button type="submit" className="btn btn-outline-success">
            update
          </button>
        ) : (
          <button type="submit" className="btn btn-outline-success">
            Submit
          </button>
        )}

        <button
          onClick={() => {
            history.push(post.boardType === "mypost" ? "/myposts" : "/posts");
          }}
          className="btn btn-outline-danger float-right"
        >
          Cancel
        </button>
      </Form>
      <div className="custom-file mb-4"></div>
    </>
  ) : (
    <Redirect to="/login" />
  );
}; // AddPost.js

export default AddPost;
