import React from "react";

const ResourceNotFound = () => {
  return (
    <div className = "d-flex justify-content-center align-items-center flex-column py-5 mx-2">
      <h1 className="border-bottom">Internal Server Error</h1>
      <h5>We are sorry the requested page cannot be displayed at this time</h5>
      <h5>Please try refreshing the page or try again later</h5>
    </div>
  );
};

export default ResourceNotFound;