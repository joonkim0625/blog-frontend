import axios from "axios";

//const devUrl = "http//localhost:8080/api"; <-- this depends on the port that node is running on
//const prodUrl = "https://joonkim.netlify.app/api";

export default axios.create({
  baseURL: "https://joonkim.netlify.app/api",
  headers: {
    "Content-tpye": "application/json",
  },
});
