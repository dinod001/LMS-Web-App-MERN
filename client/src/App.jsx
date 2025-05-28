import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CourseList from "./pages/student/CourseList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollment from "./pages/student/MyEnrollment";
import Player from "./pages/student/Player";
import Loading from "./components/student/Loading";
import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourse from "./pages/educator/MyCourse";
import StudentEnrolled from "./pages/educator/StudentEnrolled";
import NavBar from "./components/student/NavBar";

const App = () => {
  const isEducatorRouter = useMatch("/educator/*");
  return (
    <div className="text-default min-h-screen bg-white">
      {!isEducatorRouter && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input?" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollment />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourse />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
