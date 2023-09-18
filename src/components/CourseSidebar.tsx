import { useContext } from "react"
import useSWR from "swr"
import { Course, CoursePreferencesContext, DetailedCourse, fetcher } from "../utils"
import { CornerMenu } from "./Courses"

const CourseSidebar = ({ course }: { course: Course }) => {
    const { data, error, isLoading } = useSWR<DetailedCourse[]>(`/api/base/2022A/courses/CIS-${course.number}`, fetcher)
    console.log(data, error, isLoading)

    const { coursePreferences, setCoursePreferences } = useContext(CoursePreferencesContext);
    const status = coursePreferences[course.number];

    const { dept, number, title, description, prereqs, crossListed } = course;


    return (
        <div className="h-screen z-50 w-screen absolute bg-purple-400">
            <div
                className={``}
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

                <div className="">
                    <div className="flex gap-8">
                        <div>
                            <p className="font-bold uppercase text-sm text-stone-400 ibm-plex-mono">
                                {dept}
                                {" "}
                                {number}
                            </p>
                            <h2 className={`text-4xl ibm-plex-mono`}>
                                {title}
                            </h2>
                        </div>

                        {/* placeholder the same size as cornermenu */}
                        <div className="h-10 w-24 shrink-0 ml-auto"></div>
                    </div>

                    <p className="mt-2 text-stone-500">
                        {description}
                    </p>

                    {prereqs && (
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
                    )}
                    {crossListed && (
                        <p className="my-1 text-stone-500">
                            Crosslisted as:
                            {" "}
                            {crossListed.map((prereq, i) => (
                                <span key={prereq}>
                                    {i > 0 && ", "}
                                    {prereq}
                                </span>
                            ))}
                        </p>
                    )}
                </div>
            </div >

        </div>
    )
}

export default CourseSidebar