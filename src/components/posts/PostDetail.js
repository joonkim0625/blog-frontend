import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import PostDataService from "../../services/PostService";
import { AuthContext } from "../../contexts/AuthContext";
import moment from "moment";

// styles
import TextareaAutosize from "react-textarea-autosize";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";

const PostDetail = (props) => {
  const { data: auth } = useContext(AuthContext);
  let history = useHistory();
  let location = useLocation();
  let roleSet = null;

  if (auth.isAuthenticated) {
    roleSet = auth.data.roles.length > 0 ? new Set(auth.data.roles) : null;
  }

  const initialPostState = {
    postId: null,
    userId: null,
    author: "",
    title: "",
    body: "",
    boardType: "",
    file: "",
    createdAt: null,
    updatedAt: null,
  };

  const [currentPost, setCurrentPost] = useState(initialPostState);
  const [commentsArr, setCommentsArr] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect for an existing post
  useEffect(() => {
    console.log("auth", auth);
    console.log("user role = ", roleSet);
    const getPost = (postId) => {
      PostDataService.get(postId)
        .then((res) => {
          setCurrentPost({
            ...currentPost,
            postId: res.data.id,
            userId: res.data.userId,
            author: res.data.author,
            title: res.data.title,
            body: res.data.body,
            boardType: res.data.boardType,
            file: res.data.file,
            createdAt: res.data.createdAt,
            updatedAt: res.data.updatedAt,
          });
          setCommentsArr(res.data.comments);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getPost(props.match.params.id);

    setIsLoading(false);
  }, [props.match.params.id]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setIsLoggedIn(true);
    }
  }, [auth]);

  const updateComments = (postId) => {
    PostDataService.getAllComments(postId)
      .then((res) => {
        setCommentsArr(res.data.comments);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deletePost = () => {
    PostDataService.remove(currentPost.postId)
      .then((res) => {
        history.push(
          currentPost.boardType === "mypost" ? "/myposts" : "/posts"
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }; //deletePost

  const handleEditClick = (event) => {
    history.push({
      pathname: currentPost.boardType === "mypost" ? "/addmypost" : "/addpost",
      state: {
        postId: currentPost.postId,
      },
    });
  };

  const handleBackToListClick = (event) => {
    if (currentPost.boardType === "mypost") {
      history.push("/myposts");
    } else {
      history.push("/posts");
    }
  };
  // convert the flat structured array into a nested strucutred array
  const nestComments = (commentsList) => {
    // code credit => https://stackoverflow.com/questions/36829778/rendering-nested-threaded-comments-in-react
    const commentsMap = {};

    commentsList.forEach((comment) => {
      commentsMap[comment.id] = comment;
    });

    commentsList.forEach((comment) => {
      if (comment.parentId !== null) {
        const parent = commentsMap[comment.parentId];

        // this is to handle duplicate comments that has the same id
        // TODO: figure out why there are duplicates inserted when
        // fetching ...
        let parentSet = new Set((parent.children = parent.children || []));

        if (!parentSet.has(comment.id)) {
          parentSet.add(comment);
        }
        parent.children = [...parentSet];
      }
    });

    return commentsList.filter((comment) => {
      return comment.parentId === null;
    });
  };

  // rendering comments form
  const RenderCommentForm = ({ editMode, comment }) => {
    const parentId = comment === undefined ? null : comment.id;

    const [isEditMode, setIsEditMode] = useState(editMode);
    const [text, setText] = useState({
      text: "",
    });

    const data = {
      postId: currentPost.postId,
      userId: auth.data.id,
      author: auth.data.username,
      comment: text.text,
    };

    const saveComment = (data) => {
      PostDataService.createComment(data)
        .then((res) => {
          // TODO: all I needed to do was to add a new data to an existing array...
          setCommentsArr([...commentsArr, res.data]);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const createNestedComment = (commentId, data) => {
      PostDataService.createNestedComment(commentId, data)
        .then((res) => {
          // TODO: all I needed to do was to add a new data to an existing array...
          setCommentsArr([...commentsArr, res.data]);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const updateComment = (commentId) => {
      const data = {
        comment: text.text,
      };

      PostDataService.updateComment(commentId, data)
        .then((res) => {
          console.log("Comment updated!");
          updateComments(currentPost.postId);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (parentId === null && !isEditMode) {
        saveComment(data);
      } else if (parentId !== null && !isEditMode) {
        createNestedComment(parentId, data);
      } else if (isEditMode) {
        updateComment(comment.id);
        updateComments(comment.postId);
        setIsEditMode(false);
      }

      setText({ text: "" });
    };
    const handleInputChange = (event) => {
      const { name, value } = event.target;

      setText({ [name]: value });
    };

    return (
      <div className="w-100">
        <div className="card-body">
          {isLoggedIn ? (
            <>
              <form onSubmit={handleSubmit}>
                {editMode ? (
                  <>
                    <div className="form-group overflow-hidden">
                      <TextareaAutosize
                        className="form-control"
                        minRows={3}
                        onChange={handleInputChange}
                        name="text"
                        defaultValue={comment.comment}
                      />
                      <button
                        type="submit"
                        className="btn-sm btn-primary float-right"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group overflow-hidden">
                      <TextareaAutosize
                        className="form-control"
                        placeholder="Leave a commnt..."
                        minRows={3}
                        onChange={handleInputChange}
                        name="text"
                        value={text.text}
                      />
                      <button
                        type="submit"
                        className="btn-sm btn-primary float-right"
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </form>
            </>
          ) : (
            <>
              <div>If you want to leave a comment, please log in!</div>{" "}
              <Link
                to={{
                  pathname: "/login",
                  state: {
                    from: location.pathname,
                  },
                }}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }; // RenderCommentForm

  // Rendering comments
  const RenderComments = ({ comment, depth = 0 }) => {
    const [isReplyVisible, setIsReplyVisible] = useState(false);
    const [editComment, setEditComment] = useState(false);

    const nestedComments = (comment.children || []).map((comment) => {
      return (
        <RenderComments
          key={comment.id}
          comment={comment}
          depth={depth + 1}
          type="child"
        />
      );
    });

    const toggleReply = () => {
      setEditComment(false);
      setIsReplyVisible(!isReplyVisible);
    };

    const toggleEditComment = () => {
      setIsReplyVisible(false);
      setEditComment(!editComment);
      console.log(editComment);
    };
    const deleteComment = () => {
      const commentId = comment.id;
      // TODO: alert that all nested comments will also be deleted
      PostDataService.deleteComment(commentId)
        .then((res) => {
          console.log("comment deleted!");
          console.log(res.data);
          updateComments(currentPost.postId);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return (
      <ListGroup className="border mt-3">
        <ListGroup.Item
          className="pr-0 border-0"
          style={{ paddingLeft: depth * 10 }}
        >
          <h6 className="pl-2 d-inline-block">{comment.author}</h6>
          <span
            className="float-right"
            style={{ fontSize: 14, marginRight: 10 }}
          >
            {comment.createdAt === comment.updatedAt ? (
              <>
                Written on{" "}
                {moment(comment.createdAt).format("MMMM Do, YYYY at h:mm a")}
              </>
            ) : (
              <>
                Edited on{" "}
                {moment(comment.updatedAt).format("MMMM Do, YYYY at h:mm a")}
              </>
            )}
          </span>
          <Card.Body className=" border-right-0 border-left border-top border-bottom  p-2 h-100 ">
            {comment.comment}
          </Card.Body>
          <div className="btn-toolbar justify-content-end" role="toolbar">
            <div className="btn-group btn-group-sm mr-2" role="group">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={toggleReply}
              >
                reply
              </button>
              {auth.data.id === comment.userId || roleSet.has("ROLE_ADMIN") ? (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={toggleEditComment}
                  >
                    edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={deleteComment}
                  >
                    delete
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div>
            {isReplyVisible ? (
              <RenderCommentForm
                updateComments={updateComments}
                editMode={false}
                comment={comment}
              />
            ) : null}
            {editComment ? (
              <RenderCommentForm
                updateComments={updateComments}
                editMode={true}
                comment={comment}
              />
            ) : null}
          </div>

          {nestedComments}
        </ListGroup.Item>
      </ListGroup>
    );
  }; // RenderComments

  // RENDERING PAGE -> This component's renderer
  return (
    <div className="container">
      {!isLoading ? (
        <div className="row">
          <div className="col-lg-8">
            <h1 className="mt-4"> {currentPost.title}</h1>
            <p className="lead">by {currentPost.author}</p>
            <hr />
            <p style={{ fontSize: 14 }}>
              {currentPost.createdAt === currentPost.updatedAt ? (
                <>
                  Written on{" "}
                  {moment(currentPost.createdAt).format(
                    "MMMM Do, YYYY at h:mm a"
                  )}
                </>
              ) : (
                <>
                  Edited on{" "}
                  {moment(currentPost.updatedAt).format(
                    "MMMM Do, YYYY at h:mm a"
                  )}
                </>
              )}
            </p>
            <hr />

            <div
              style={{ minHeight: 200 }}
              dangerouslySetInnerHTML={{ __html: currentPost.body }}
            />
            <hr />
            {auth.data.id === currentPost.userId ? (
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleEditClick}
              >
                Edit
              </button>
            ) : null}
            {auth.data.id === currentPost.userId ||
            roleSet.has("ROLE_ADMIN") ? (
              <button
                className="btn btn-outline-danger ml-2"
                onClick={deletePost}
              >
                Delete{" "}
              </button>
            ) : null}

            <button
              type="button"
              className="btn btn-outline-info float-right"
              onClick={handleBackToListClick}
            >
              Back to list
            </button>
          </div>
          <div
            className="card my-4 w-100"
            style={{ backgroundColor: "white", border: 0, boxShadow: "none" }}
          >
            Comments {commentsArr.length}
            <RenderCommentForm />
            {commentsArr &&
              nestComments(commentsArr).map((comment) => {
                return <RenderComments key={comment.id} comment={comment} />;
              })}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>
            Loading...
            <span className="spinner-border spinner-border-sm"></span>
          </p>
        </div>
      )}
    </div>
  );
}; // PostDetail.js

export default PostDetail;
