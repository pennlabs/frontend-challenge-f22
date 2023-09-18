import CourseGraph from "../components/CourseGraph";
import courseData from "../data/courses.json";
import prerequisites from "../data/prerequisites.json";

function App() {
    return (
        // make it take up the entire screen minus the navbar
        <div style={{ height: "calc(100vh - 88px)" }} className="relative">
            <div className="absolute text-center text-stone-400 w-full mt-8 opacity-30 hover:opacity-50 transition-colors">
                <h1 className="font-bold text-6xl ibm-plex-mono">Computer Science Courses</h1>
                <p className="ibm-plex-mono text-3xl">and their prerequisites</p>
            </div>
            <CourseGraph courses={courseData.map(c => ({ id: c.number, label: c.dept + "-" + c.number }))} prerequisites={prerequisites} />
        </div>
    );
}

export default App;
