import { useContext } from "react";
import { useToasts } from "react-toast-notifications";
import { Course, CoursePreferencesContext } from "../utils";


const Courses = ({ courses }: { courses: Course[] }) => {
    return (
        <div className="grid grid-cols-2 gap-x-16 gap-y-24">
            {courses.map(course => <CourseCard key={course.number} course={course} />)}
        </div>

    )
}

export default Courses;

const MinusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)


function CourseCard({ course }: { course: Course }) {
    const { dept, number, title, prereqs, description } = course;


    const { coursePreferences, setCoursePreferences } = useContext(CoursePreferencesContext);
    const status = coursePreferences[number];

    function handleExpand() {

    }

    const isGreyedOut = status === "taken" || status === "uninterested";

    return (
        <div
            className={`relative rounded-xl ${isGreyedOut ? "opacity-50" : "cursor-pointer"}`}
        >
            {/* Design pattern of putting absolute elments in relative parents allows stacking of elements with the same size */}
            {/* One child of the relative parent is static (in this case, coursecard) which determines the size of the container */}

            {/* The taken symbol will be placed perfectly behind the other children */}
            {status === "taken" && (
                <div
                    className="absolute w-full h-full opacity-20 flex items-center justify-center"
                    style={{ zIndex: -1 }} // allow "read more" in the description to be clicked
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                </div>

            )}

            {/* The cornermenu is taken out of the static container because we do not want hovering the button to cause hover events */}
            {/* for the container */}
            <div className="absolute w-full top-0 left-0 flex">
                <div className="ml-auto">
                    <CornerMenu course={course} />
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
                        <h2 className={`${title.length <= 20 ? "text-3xl" : title.length <= 35 ? "text-2xl" : "text-xl"} ibm-plex-mono ${!isGreyedOut && "coursecard-title"}`}>
                            {title}
                        </h2>
                    </div>

                    {/* placeholder the same size as cornermenu */}
                    <div className="h-10 w-24 shrink-0 ml-auto"></div>
                </div>

                <p className="mt-2 text-stone-500">
                    {description.split(" ").slice(0, 25).join(" ") + "..."} <button className="text-upenn-blue" onClick={handleExpand}>Read more</button>
                </p>
                {/* 
            {
                prereqs && (
                    <p className="my-1 text-stone-500">
                        Prerequisites:
                        {" "}
                        {prereqs.map((prereq, i) => (
                            <span key={prereq}>
                                {i > 0 && ", "}
                                {prereq}
                            </span>
                        ))}
                    </p>
                )
            } */}
            </div>
        </div >
    )
}

const CornerMenu = ({ course }: { course: Course }) => {
    const { addToast } = useToasts();
    const { coursePreferences, setCoursePreferences } = useContext(CoursePreferencesContext);

    const status = coursePreferences[course.number];
    const isGreyedOut = status === "taken" || status === "uninterested";
    const { number } = course;

    function handleMarkAsTaken() {
        setCoursePreferences((prev) => {
            const newCoursePreferences = { ...prev };
            newCoursePreferences[number] = prev[number] === "taken" ? "none" : "taken";
            return newCoursePreferences;
        });
    }

    function handleMarkAsUninterested() {
        setCoursePreferences((prev) => {
            const newCoursePreferences = { ...prev };
            newCoursePreferences[number] = prev[number] === "uninterested" ? "none" : "uninterested";
            return newCoursePreferences;
        });
    }

    function handleAddToCart(number: number) {
        setCoursePreferences((prev) => {
            const newCoursePreferences = { ...prev };
            newCoursePreferences[number] = "cart";
            return newCoursePreferences;
        });

        addToast(<p className="bg-upenn-blue">Added CIS {number} to cart! <a className="underline" href="https://lauragao.ca">View cart</a></p>, {
            appearance: "success",
            autoDismiss: true,
            placement: "top-center",
        });
    }

    return (
        // cornermenu has dimensions of (in tailwind units):
        // width: button + gap + button = 10 + 4 + 10 = 24
        // height: button = 10
        <div className="flex flex-row gap-4">
            {!isGreyedOut && <button
                className="w-10 h-10 rounded-md p-2 bg-stone-200 hover:bg-stone-400 transition-colors"
                onClick={() => handleAddToCart(number)}
                data-tooltip={status === "cart" ? "View cart" : "Add to cart"}
            >
                {status === "cart" ? (
                    // shopping cart svg
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                    </svg>
                ) : (
                    /* plus sign svg */
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>}

            <div className="relative">
                {/* menu */}
                <button className="menu-icon w-10 h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                <div className="absolute bg-white text-xs text-left hidden menu border border-black">
                    <button className="flex items-center p-1.5 hover:bg-stone-100" onClick={handleMarkAsTaken}>
                        {status === "taken" ? <MinusCircleIcon /> : <CheckIcon />}
                        <span>{status === "taken" ? "Unmark as taken" : "Mark as taken"}</span>
                    </button>
                    <button className="flex items-center p-1.5 hover:bg-stone-100" onClick={handleMarkAsUninterested}>
                        <MinusCircleIcon />
                        <span>{status === "uninterested" ? "Unmark as not interested" : "Mark as not interested"}</span>
                    </button>
                </div>

            </div>
        </div>
    )
}