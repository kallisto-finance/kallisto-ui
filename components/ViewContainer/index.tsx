import React from "react";

const ViewContainer = ({ children, logo }) => (
  <div className="view-container">
    {logo && <img src="/assets/logo.png" className="logo" />}
    {children}
  </div>
);

export default ViewContainer;
