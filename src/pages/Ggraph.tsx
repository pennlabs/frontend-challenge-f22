import CourseGraph from "../components/CourseGraph";
import courseData from "../data/courses.json";
import prerequisites from "../data/prerequisites.json";

function App() {
    return (
        // make it take up the entire screen minus the navbar
        <div style={{ height: "calc(100vh - 88px)" }} className="relative">
            <h1 className="absolute">Computer Science Courses</h1>
            <CourseGraph courses={courseData.map(c => ({ id: c.number, label: c.dept + "-" + c.number }))} prerequisites={prerequisites} />
        </div>
    );
}

export default App;
