import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import PostDataService from "../../services/PostService";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "@material-ui/lab/Pagination";
const queryString = require("query-string");

const PostsList = (props) => {
  let history = useHistory();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const pageSizes = [3, 6, 9];

  useEffect(() => {
    if (props.location.search) {
      const { page, size } = { ...queryString.parse(props.location.search) };
      if (page !== undefined) {
        setPage(+page);
      }
      if (size !== undefined) {
        setPageSize(+size);
      }
    }
    getPosts();
    setIsLoading(false);
  }, [props, page, pageSize]);

  const getRequestParams = (page, pageSize) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  const getPosts = () => {
    const params = getRequestParams(page, pageSize);

    PostDataService.getAll(params)
      .then((response) => {
        const { posts, totalPages } = response.data;

        setPosts(posts);
        setCount(totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    console.log(page);
    history.push({
      pathname: `/posts`,
      search: `?page=${value}&size=${pageSize}`,
    });
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
    history.push({
      pathname: `/posts`,
      search: `?page=1&size=${event.target.value}`,
    });
  };

  return (
    <>
      {isLoading ? (
        <div>loading posts...</div>
      ) : (
        <>
          <div className="list row" style={{ minHeight: 400 }}>
            <div className="col-md-6">
              <h4>Articles</h4>

              <ListGroup>
                {posts &&
                  posts.map((post, index) => (
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
          <Link to="/addpost" className={"m-3 btn btn-sm btn-danger "}>
            Write a Post{" "}
          </Link>
          <div className="mt-3">
            {"Posts per Page: "}
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
      )}
    </>
  );
}; // PostsList.js

export default PostsList;
