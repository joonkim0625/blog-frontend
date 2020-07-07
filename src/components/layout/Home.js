import React from "react";

const Home = () => {
  return (
    <>
      <h1 style={{ marginTop: 80 }}>Hello!</h1>
      <div className="container">
        <p>
          Welcome to Joon's personal blog! <br /> This is where I will be
          writing about things I learn and my thoughts on things.
          <br />I hope you have a great time here!
        </p>

        <span>To contact me:</span>
        <br />
        <span>Email: </span>
        <a
          href="mailto:kim00967@umn.edu"
          target="_blank"
          rel="noopener noreferrer"
        >
          kim00967@umn.edu
        </a>
        <br />
        <span>GitHub: </span>
        <a href="https://github.com/joonkim0625" target="_blank">
          github.com/joonkim0625
        </a>
        <br />
        <span>LinkedIn: </span>
        <a href="https://linkedin.com/in/joonkim0625" target="_blank">
          linkedin.com/in/joonkim0625{" "}
        </a>
        <br />
      </div>
    </>
  );
};

export default Home;
