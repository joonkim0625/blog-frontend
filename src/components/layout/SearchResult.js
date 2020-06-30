import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostDataService from "../../services/PostService";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "@material-ui/lab/Pagination";
const queryString = require("query-string");

const SearchResult = (props) => {
  const [posts, setPosts] = useState([]);
  const [numOfPosts, setNumOfPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const pageSizes = [3, 6, 9];

  useEffect(() => {
    const { tsquery } = queryString.parse(props.location.search);
    if (props.history.action === "POP") {
      PostDataService.search(tsquery)
        .then((result) => {
          setPosts(result.data.posts);
          setNumOfPosts(result.data.posts.length);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setPosts(props.location.data.posts);
      setNumOfPosts(props.location.data.posts.length);
    }
    calculateCount();

    setIsLoading(false);
  }, [props, page, pageSize, numOfPosts]);

  const indexOfLastPost = page * pageSize;
  const indexOfFirstPost = indexOfLastPost - pageSize;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const calculateCount = () => {
    setCount(Math.ceil(numOfPosts / pageSize));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  return (
    <>
      {isLoading ? (
        <div>loading posts...</div>
      ) : posts.length > 0 ? (
        <>
          <div className="list row">
            <div className="col-md-6">
              <h4>Search Results</h4>

              <ListGroup>
                {currentPosts &&
                  currentPosts.map((post, index) => (
                    <Link
                      className="text-decoration-none"
                      to={"/post/" + post.id}
                      key={index}
                    >
                      <ListGroup.Item action>{post.title}</ListGroup.Item>
                    </Link>
                  ))}
              </ListGroup>
            </div>
          </div>
          <div className="mt-3">
            {"Items per Page: "}
            <select onChange={handlePageSizeChange} value={pageSize}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <Pagination
              className="my-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div>Nothing was found!</div>
      )}
    </>
  );
}; // SearchResult.js

export default SearchResult;
