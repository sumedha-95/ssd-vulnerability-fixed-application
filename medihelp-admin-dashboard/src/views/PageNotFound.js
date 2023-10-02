import React from "react";
import notFoundImg from "../assets/images/notFound.svg";

const PageNotFound = () => {
  return (
    <React.Fragment>
      <center>
        <h1>Page Not Found!</h1>
      </center>
      <img src={notFoundImg} alt="not found" />
    </React.Fragment>
  );
};

export default PageNotFound;
