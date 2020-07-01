import axios from "axios";

export default axios.create({
  baseURL: "https://joonkim.netlify.app/api",
  headers: {
    "Content-tpye": "application/json",
  },
});
