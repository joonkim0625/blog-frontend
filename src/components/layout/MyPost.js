import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import PostDataService from "../../services/PostService";
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment";
const queryString = require("query-string");

const MyPost = (props) => {
  const { data } = useContext(AuthContext);
  let history = useHistory();
  let roleSet = null;
  if (data.isAuthenticated) {
    roleSet = data.data.roles.length > 0 ? new Set(data.data.roles) : null;
  }

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

    PostDataService.getAllFromMyPosts(params)
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
      pathname: `/myposts`,
      search: `?page=${value}&size=${pageSize}`,
    });
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
    history.push({
      pathname: `/myposts`,
      search: `?page=1&size=${event.target.value}`,
    });
  };

  const truncate = (content) => {
    return content.length > 20 ? content.substring(0, 60) + "..." : content;
  };

  return (
    <>
      {isLoading ? (
        <div>is loading...</div>
      ) : (
        <>
          <div className="container" style={{ minHeight: 400 }}>
            <div className="row">
              <div className="col-md-8">
                <h1 className="my-4">Hello, World!</h1>

                {
                  // actual blog post content starts below
                }

                {posts &&
                  posts.map((post, index) => (
                    <div key={index} className="card mb-4">
                      <div className="card-body">
                        <h2>{post.title}</h2>
                        <p
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          className="card-text"
                          dangerouslySetInnerHTML={{
                            __html: truncate(post.body),
                          }}
                        />

                        <button
                          className="btn btn-outline-primary"
                          onClick={() => {
                            history.push(`/mypost/${post.id}`);
                          }}
                        >
                          Read more!{" "}
                        </button>
                      </div>
                      <div className="card-footer ">
                        {moment(post.createdAt).format(
                          "MMMM Do, YYYY at h:mm a"
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {data.isAuthenticated && roleSet.has("ROLE_ADMIN") ? (
            <>
              <button
                onClick={() => {
                  history.push("/addmypost");
                }}
                className="btn btn-outline-secondary"
              >
                Write
              </button>
            </>
          ) : null}

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
}; // MyPost.js

export default MyPost;
