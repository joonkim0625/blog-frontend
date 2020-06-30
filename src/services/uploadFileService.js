import http from "../httpCommon";
const getFiles = () => {
  return http.get("/files");
};

const uploadFile = (file) => {
  let formData = new FormData();
  formData.append("file", file);
  return http.post("/uploadfile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  getFiles,
  uploadFile,
};
