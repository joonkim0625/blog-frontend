import axios from "axios";

//const devUrl = "http//localhost:8080/api";
const prodUrl = "https://joonkim.netlify.app/api";

export default axios.create({
  baseURL: prodUrl,
  headers: {
    "Content-tpye": "application/json",
  },
});
