import {
    Route,
    BrowserRouter as Router,
    Routes
} from "react-router-dom";

import { useEffect, useState } from "react";
import { ToastProvider } from "react-toast-notifications";
import "./App.css";
import CourseSidebar from "./components/CourseSidebar";
import Nav from "./components/Nav";
import courseData from "./data/courses.json";
import Cart from "./pages/Cart";
import Graph from "./pages/Ggraph";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Course, CoursePreference, CoursePreferencesContext, SidebarCourseContext } from "./utils";


const localStorageKey = "PENNCOURSECART_COURSE_PREFERENCES";
const localStorageCoursePreferences = localStorage.getItem(localStorageKey);
const initialCoursePreferences = localStorageCoursePreferences ? (
    JSON.parse(localStorageCoursePreferences)
) : (
    courseData.reduce((acc: CoursePreference, course) => {
        acc[course.number] = "none";
        return acc;
    }, {})
);

function App() {
    // reduce the course data to a map of course number to preference
    const [coursePreferences, setCoursePreferences] = useState<CoursePreference>(initialCoursePreferences)
    const [sidebarCourse, setSidebarCourse] = useState<Course | null>(null);

    // whenever the course preferences change, save them to local storage
    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(coursePreferences));
    }, [coursePreferences]);


    return (
        <ToastProvider
            placement="top-center"
        >
            <CoursePreferencesContext.Provider value={{ coursePreferences: coursePreferences, setCoursePreferences: setCoursePreferences }}>
                <SidebarCourseContext.Provider value={{ sidebarCourse: sidebarCourse, setSidebarCourse: setSidebarCourse }}>
                    <Router>
                        <div>
                            <Nav />

                            {/* Routes */}
                            <div className="flex w-screen">
                                <div className="flex-grow" style={sidebarCourse ? { maxHeight: "calc(100vh - 88px)", overflowY: "auto", overflowX: "hidden" } : {}}>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="cart" element={<Cart />} />
                                        <Route path="graph" element={<Graph />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </div>
                                <CourseSidebar />
                            </div>
                        </div>
                    </Router>
                </SidebarCourseContext.Provider>
            </CoursePreferencesContext.Provider>
        </ToastProvider>
    );
}

export default App;
