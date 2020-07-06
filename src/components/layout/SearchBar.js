import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PostDataService from "../../services/PostService";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const SearchBar = () => {
  let history = useHistory();

  const [searchText, setSearchText] = useState("");
  const onChangeSearchText = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
  };

  const handleSearchText = (e) => {
    e.preventDefault();
    if (searchText.trim() === "") {
      return;
    } else {
      PostDataService.search(searchText)
        .then((result) => {
          history.push({
            pathname: "/searchResults",
            search: `?tsquery=${result.data.tsquery}`,
            data: result.data,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  return (
    <>
      <Form inline>
        <FormControl
          type="text"
          className="mr-sm-2"
          aria-label="Search"
          placeholder="Search Posts"
          value={searchText}
          onChange={onChangeSearchText}
        />
        <Button
          variant="outline-success"
          type="submit"
          onClick={handleSearchText}
        >
          Search
        </Button>
      </Form>
    </>
  );
}; // SearchBar.js

export default SearchBar;
