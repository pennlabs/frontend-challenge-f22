import { ReactNode, useContext } from "react"
import Skeleton from "react-loading-skeleton"
import { Link } from "react-router-dom"
import useSWR from "swr"
import { Course, CoursePreferencesContext, DetailedCourse, fetcher } from "../utils"


// Helper icons and buttons that are commonly used on this page
const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
    </svg>
)

const MinusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const CheckmarkCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const PlusIcon = () => (
    < svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-current" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg >
)

const PrimaryButton = ({ children, onClick }: { children: ReactNode, onClick?: () => void }) => (
    <button onClick={onClick} className="p-4 text-white bg-upenn-blue hover:bg-black rounded-lg flex items-center gap-2 text-sm transition">
        {children}
    </button>
)

const SecondaryButton = ({ children, onClick }: { children: ReactNode, onClick?: () => void }) => (
    <button onClick={onClick} className="p-4 text-upenn-blue hover:text-white hover:bg-upenn-blue border-2 border-upenn-blue rounded-lg flex items-center gap-2 text-sm transition">
        {children}
    </button>
)

const ViewCartButton = ({ type }: { type: "primary" | "secondary" }) => {
    const children = (
        <>
            <ShoppingCartIcon />
            <span>View cart</span>
        </>
    )
    return (
        <Link to="/cart">
            {type === "primary" ? <PrimaryButton>{children}</PrimaryButton> : <SecondaryButton>{children}</SecondaryButton>}
        </Link>
    )
}

// Rename to RedSecondaryButton when not all red buttons use the same icon
const DeleteButton = ({ children, onClick }: { children: string, onClick?: () => void }) => (
    <button onClick={onClick} className="p-4 text-upenn-red hover:text-white hover:bg-upenn-red border-2 border-upenn-red rounded-lg flex items-center gap-2 text-sm transition">
        <MinusCircleIcon />
        <span>
            {children}
        </span>
    </button>
)


const CourseSidebar = ({ course }: { course: Course }) => {
    const { dept, number, title, description, prereqs, crossListed } = course;
    const { data, error, isLoading } = useSWR<DetailedCourse>(`/api/base/2022A/courses/CIS-${course.number}`, fetcher)
    // @ts-ignore - api returns { detail: "Not found." } when error
    const success = data && data?.detail !== "Not found.";

    const { coursePreferences, setCoursePreferences } = useContext(CoursePreferencesContext);
    const status = coursePreferences[course.number];

    function handleChangeStatus(newStatus: "none" | "cart" | "taken" | "uninterested") {
        setCoursePreferences((prev) => {
            const newCoursePreferences = { ...prev };
            newCoursePreferences[number] = newStatus;
            return newCoursePreferences;
        });
    }

    return (
        <div className="z-30 absolute border-l-4 border-stone-400 shadow-lg px-8 overflow-y-scroll" style={{ height: "calc(100vh - 88px" }}>
            <div
                className={`my-16 relative`}
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

                <div className="">
                    <div className="flex gap-8">
                        <div>
                            <p className="font-bold uppercase text-sm text-stone-400 ibm-plex-mono">
                                {dept}
                                {" "}
                                {number}
                            </p>
                            <h2 className={`text-4xl ibm-plex-mono font-light`}>
                                {title}
                            </h2>
                        </div>

                        {/* placeholder the same size as cornermenu */}
                        <div className="h-10 w-24 shrink-0 ml-auto"></div>
                    </div>

                    <p className="mt-6 text-stone-500 text-lg">
                        {description}
                    </p>

                    {prereqs && (
                        <p className="my-6 text-stone-400">
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
                        <p className="my-6 text-stone-400">
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

                    <div className="my-16 text-lg text-stone-500 w-full relative">
                        <div className="absolute top-0 text-upenn-blue opacity-20 flex flex-col gap-3 -mt-6" style={{ zIndex: -2 }}>
                            <p className="uppercase ibm-plex-mono text-xs">[Data from Penn Course Review]</p>
                            <p className="uppercase ibm-plex-mono text-xs">[Data from Penn Course Review]</p>
                            <p className="uppercase ibm-plex-mono text-xs">[Data from Penn Course Review]</p>
                            <p className="uppercase ibm-plex-mono text-xs">[Data from Penn Course Review]</p>
                            <p className="uppercase ibm-plex-mono text-xs">[Data from Penn Course Review]</p>
                        </div>
                        <p className="mb-6">Course quality:
                            {" "}
                            {data ? (
                                <span className="mx-2 px-3 py-2 border-2 border-stone-500 rounded-lg">{data.course_quality || "N/A"}</span>
                            ) : (
                                isLoading ? (
                                    <Skeleton width={70} height={30} />
                                ) : (
                                    <span className="mx-2 px-3 py-2 border-2 border-stone-500 rounded-lg">N/A</span>
                                )
                            )}
                        </p>
                        <p className="my-6">Instructor quality:
                            {" "}
                            {success ? (
                                <span className="mx-2 px-3 py-2 border-2 border-stone-500 rounded-lg">{data.instructor_quality || "N/A"}</span>
                            ) : (
                                isLoading ? (
                                    <Skeleton width={70} height={30} />
                                ) : (
                                    <span className="mx-2 px-3 py-2 border-2 border-stone-500 rounded-lg">N/A</span>
                                )
                            )}
                        </p>
                    </div>

                    {status === "cart" ? (
                        <div className="mt-40">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckmarkCircleIcon />
                                <span>This course is in your cart</span>
                            </div>

                            <div className="flex items-center gap-4 mt-8">
                                <ViewCartButton type="primary" />
                                <DeleteButton onClick={() => handleChangeStatus("none")}>Remove course from cart</DeleteButton>
                            </div>
                        </div>
                    ) : status === "none" ? (
                        <div className="flex items-center gap-4 mt-40">
                            <PrimaryButton onClick={() => handleChangeStatus("cart")}>
                                <PlusIcon />
                                <span>Add to cart</span>
                            </PrimaryButton>

                            <ViewCartButton type="secondary" />
                        </div>
                    ) : (
                        status === "taken" ? (
                            <div className="mt-40">
                                <div className="flex items-center gap-2 mb-4 text-green-600">
                                    <CheckmarkCircleIcon />
                                    <span>
                                        You already took this class
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mt-8">
                                    <DeleteButton onClick={() => handleChangeStatus("none")}>Remove from taken courses</DeleteButton>
                                    <ViewCartButton type="primary" />
                                </div>
                            </div>
                        ) : (
                            // status must be uninterested
                            <div className="mt-40">
                                <div className="flex items-center gap-2 mb-4 text-upenn-red">
                                    <MinusCircleIcon />
                                    <span>
                                        You marked this class as uninterested
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mt-8">
                                    <SecondaryButton onClick={() => handleChangeStatus("none")}>
                                        <MinusCircleIcon />
                                        <span>
                                            Remove from uninterested courses
                                        </span>
                                    </SecondaryButton>
                                    <ViewCartButton type="primary" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div >

        </div >
    )
}

export default CourseSidebar