import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useSWR from "swr";
import Cart from "../components/Cart";
import Courses from "../components/Courses";
import SearchInput from "../components/SearchInput";
import { Course, fetcher } from "../utils";

function LoadingCourse() {
    return (
        <div>
            <Skeleton width={70} />
            <Skeleton height={70} />
            <Skeleton count={11} />
        </div>
    )
}

export default function Home() {
    const semester = "2023C"
    const { data: courseData, error, isLoading } = useSWR(`/api/base/${semester}/courses`, fetcher);
    const { data: mmm } = useSWR(`/api/base/${semester}/courses/CIS-2400`, fetcher);
    console.log(courseData, error, isLoading)
    console.log(mmm)

    const [courses, setCourses] = useState<Course[]>([]);
    // in semantic search, we show additional courses that are similar to the query that didn"t make it into the main search.
    const [additonalCourses, setAdditionalCourses] = useState<Course[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    return (
        <>
            <div className="my-8">
                <SearchInput setCourses={setCourses} setAdditionalCourses={setAdditionalCourses} setIsLoading={setIsSearchLoading} />
            </div>

            <div className="w-full px-4 max-w-4xl mx-auto">
                {isSearchLoading ? (
                    <div className="grid grid-cols-2 gap-8">
                        <LoadingCourse />
                        <LoadingCourse />
                        <LoadingCourse />
                        <LoadingCourse />
                    </div>
                ) : (
                    <>
                        <p className="text-stone-400">Showing {courses.length} results</p>
                        <Courses courses={courses} />
                        {additonalCourses.length > 0 && <p className="text-center my-12 text-stone-400 text-xl">You might also like:</p>}
                        <Courses courses={additonalCourses} />
                    </>
                )}
                <Cart />
            </div>
        </ >
    );
}
