import {
    Route,
    BrowserRouter as Router,
    Routes
} from "react-router-dom";

import { useState } from "react";
import { ToastProvider } from "react-toast-notifications";
import "./App.css";
import Nav from "./components/Nav";
import courseData from "./data/courses.json";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { CoursePreference, CoursePreferencesContext } from "./utils";


function App() {
    // reduce the course data to a map of course number to preference
    const [initialCoursePreferences, setCoursePreferences] = useState<CoursePreference>(
        courseData.reduce((acc: CoursePreference, course) => {
            acc[course.number] = "none";
            return acc;
        }, {})
    )

    return (
        <ToastProvider
            placement="top-center"
        >
            <CoursePreferencesContext.Provider value={{ coursePreferences: initialCoursePreferences, setCoursePreferences: setCoursePreferences }}>
                <Router>coursePreferences
                    <div>
                        <Nav />

                        {/* Routes */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </Router>
            </CoursePreferencesContext.Provider>
        </ToastProvider>
    );
}

export default App;
