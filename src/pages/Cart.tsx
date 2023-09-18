import { useContext } from "react";
import { Link } from "react-router-dom";
import courseData from "../data/courses.json";
import { Course, CoursePreferencesContext, SidebarCourseContext } from "../utils";


function Cart() {
    const { coursePreferences } = useContext(CoursePreferencesContext);
    const cartCourses = courseData.filter(c => coursePreferences[c.number] === "cart");

    return (
        <>
            <div className="px-4 mx-auto max-w-6xl pb-32">
                <h1 className="text-center ibm-plex-mono font-thin uppercase text-6xl my-24">Your Cart ({cartCourses.length})</h1>
                <div className="grid md:grid-cols-3 gap-x-16 gap-y-24">
                    {cartCourses.map(course => <CartCourseCard key={course.number} course={course} />)}
                    {!cartCourses.length && <p className="text-center text-stone-400 text-xl">Your cart is empty!</p>}
                </div>
                <div className="mt-32">
                    <Link to="/checkout">
                        <div className="p-4 rounded-full text-upenn-blue border-2 border-upenn-blue w-full flex justify-center hover:bg-upenn-blue hover:text-white transition-colors">
                            Checkout courses
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}

function CartCourseCard({ course }: { course: Course }) {
    const { dept, number, title, description } = course;

    const { setSidebarCourse } = useContext(SidebarCourseContext);
    const { setCoursePreferences } = useContext(CoursePreferencesContext);

    function handleExpand() {
        setSidebarCourse(course);
    }

    function handleRemoval() {
        setCoursePreferences((prev) => {
            const newCoursePreferences = { ...prev };
            newCoursePreferences[number] = "none";
            return newCoursePreferences;
        });
    }

    return (
        <div
            className={`relative rounded-xl cursor-pointer`}
        >
            {/* The cornermenu is taken out of the static container because we do not want hovering the button to cause hover events */}
            {/* for the container */}
            <div className="absolute w-full top-0 left-0 flex">
                <div className="ml-auto">
                    <button className="text-upenn-red" data-tooltip="Remove from cart" onClick={handleRemoval}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="coursecard" onClick={handleExpand} >
                <div className="flex gap-8">
                    <div>
                        <p className="font-bold uppercase text-sm text-stone-400 ibm-plex-mono">
                            {dept}
                            {" "}
                            {number}
                        </p>
                        <h2 className={`${title.length <= 20 ? "text-3xl" : title.length <= 35 ? "text-2xl" : "text-xl"} ibm-plex-mono coursecard-title`}>
                            {title}
                        </h2>
                    </div>

                    {/* placeholder the same size as cornermenu */}
                    <div className="h-10 w-10 shrink-0 ml-auto"></div>
                </div>

                <p className="mt-2 text-stone-500">
                    {description.split(" ").slice(0, 25).join(" ") + "..."} <button className="text-upenn-blue" onClick={handleExpand}>Read more</button>
                </p>
            </div>
        </div >
    )
}

export default Cart