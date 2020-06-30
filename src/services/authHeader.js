export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    return {
      "x-access-token": "bearer " + user.accessToken,
    };
  } else {
    return {};
  }
}
