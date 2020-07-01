import axios from "axios";

export default axios.create({
  baseURL: "https://joonkim.herokuapp.com/api",
  headers: {
    "Content-tpye": "application/json",
  },
});
