import React from "react";
import { Outlet } from "react-router-dom";

const Educator = () => {
  return (
    <div>
      <h1>Educator</h1>
      {<Outlet />}
    </div>
  );
};

export default Educator;
