import { CoursePreferencesContext } from "../utils";

import { useContext } from "react";
import courseData from "../data/courses.json";

const Checkout = () => {
    const { coursePreferences } = useContext(CoursePreferencesContext);
    const cartCourses = courseData.filter(c => coursePreferences[c.number] === "cart");

    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="0.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 8.25V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
            </svg>

            <h1>RECIEPT</h1>
            <div className="grid grid-cols-2 ibm-plex-mono font-thin uppercase">
                {cartCourses.map((course) => (<>
                    <div>{course.title}</div>
                    <div>{course.dept + "-" + course.number}</div>
                </>))}
            </div>
        </div>
    )
}

export default Checkout