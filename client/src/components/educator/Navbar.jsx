import React from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import yt_logo from "../../assets/yt_logo.png";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b bg-gray-900  py-3">
      <Link to="/">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={yt_logo} alt="Logo" className="w-11 lg:w-15" />
          <h1 className="text-xl font-semibold text-white">CodeSage LK</h1>
        </div>
      </Link>
      <div className="flex items-center gap-5 text-white relative">
        <p>Hi! {user ? user.fullName : "Developers"}</p>
        {user ? (
          <UserButton />
        ) : (
          <img className="max-w-8" src={assets.profile_img} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
