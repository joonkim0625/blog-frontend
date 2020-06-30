import React, { useState } from "react";

const CommentForm = ({ saveComment, handleSubmit }) => {
  const [comment, setComment] = useState("");

  return (
    <div className="card my-4">
      <h5 className="card-header">Leave a Comment:</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="3"
              onChange={(value) => {
                setComment(value.target.value);
                saveComment();
              }}
              defaultValue={comment}
            />{" "}
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentForm;
