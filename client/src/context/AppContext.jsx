import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../../src/assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [allCourses, seALLtCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const navigate = useNavigate();

  //fetch all courses
  const fetchAllCourse = async () => {
    seALLtCourses(dummyCourses);
  };

  //clalclate course rating
  const calculateRatings = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRatings = 0;
    course.courseRatings.forEach((rating) => {
      totalRatings += rating.rating;
    });
    return totalRatings / course.courseRatings.length;
  };

  useEffect(() => {
    fetchAllCourse();
  }, []);

  const value = {
    currency,
    allCourses,
    navigate,
    isEducator,
    setIsEducator,
    calculateRatings,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
