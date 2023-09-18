import {
    Route,
    BrowserRouter as Router,
    Routes
} from "react-router-dom";

import { useEffect, useState } from "react";
import { ToastProvider } from "react-toast-notifications";
import "./App.css";
import Nav from "./components/Nav";
import courseData from "./data/courses.json";
import All from "./pages/All";
import Graph from "./pages/Ggraph";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { CoursePreference, CoursePreferencesContext } from "./utils";


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

    // whenever the course preferences change, save them to local storage
    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(coursePreferences));
    }, [coursePreferences]);


    return (
        <ToastProvider
            placement="top-center"
        >
            <CoursePreferencesContext.Provider value={{ coursePreferences: coursePreferences, setCoursePreferences: setCoursePreferences }}>
                <Router>coursePreferences
                    <div>
                        <Nav />

                        {/* Routes */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="all" element={<All />} />
                            <Route path="graph" element={<Graph />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </Router>
            </CoursePreferencesContext.Provider>
        </ToastProvider>
    );
}

export default App;
