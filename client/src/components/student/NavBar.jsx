import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import yt_logo from "../../assets/yt_logo.png";
import { useEffect } from "react";

const NavBar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);

  useEffect(() => {
    {
      console.log(isEducator);
    }
  }, []);
  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  const isCourseListPage = location.pathname.includes("/course-list");
  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-700 py-4 ${
        isCourseListPage ? "bg-gray-900" : "bg-gray-900"
      }`}
    >
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={yt_logo} alt="Logo" className="w-11 lg:w-15" />
        <h1 className="text-xl font-semibold text-white">CodeSage LK</h1>
      </div>

      <div className="hidden md:flex items-center gap-5 text-white">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |<Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>

        {/*if the user already signed in, below function are showing suitable functions for that*/}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>

      {/*For phone screen*/}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-white">
        <div className="md:hidden flex items-center gap-1 sm:gap-2 max-sm:text-xs ">
          {user && (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |<Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="Profile" className="w-10 h-11" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
