import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Profile = () => {
  const { data } = useContext(AuthContext);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{data.data.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {data.data.accessToken.substring(0, 20)} ...{" "}
        {data.data.accessToken.substr(data.data.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {data.data.id}
      </p>
      <p>
        <strong>Email:</strong> {data.data.email}
      </p>
      <strong>data:</strong>
      <ul>
        {data.data.roles &&
          data.data.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
};

export default Profile;
