import axios from "axios";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import courseData from "../data/courses.json";
import { Course, CoursePreferencesContext, CourseWithSimilarity } from "../utils";


function semanticSimilarity(a: number[], b: number[]) {
    const dot = (a: Float64Array, b: Float64Array) =>
        a.reduce((prev, curr, index) => prev + curr * b[index]);

    const norm = (x: Float64Array) =>
        Math.sqrt(x.reduce((prev, curr) => prev + curr * curr));

    const aEmbed = new Float64Array(a);
    const bEmbed = new Float64Array(b);
    return dot(aEmbed, bEmbed) / (norm(aEmbed) * norm(bEmbed));
}


// if a query contains quotation marks, returns true if it contains at least one thing in the quotation marks.
// if query doesn't contain quotation marks, then return true if it includes the entire query.
function matchQuery(query: string, longText: string) {
    const normalizedQuery = query.toLowerCase();
    const normalizedLongText = longText.toLowerCase();

    if (normalizedLongText.includes(normalizedQuery)) return true;

    if (normalizedQuery.includes('"')) {
        // Extract everything between the quotation marks
        const matches = normalizedQuery.match(/"(.*?)"/g);

        if (!matches) return false;

        // Check if any matched content between quotation marks is present in longText
        for (let match of matches) {
            const strippedMatch = match.slice(1, -1).trim();
            if (normalizedLongText.includes(strippedMatch)) {
                return true;
            }
        }
    }

    return false;
}


const SearchInput = ({ setCourses, setAdditionalCourses, setIsLoading }:
    {
        setCourses: Dispatch<SetStateAction<(Course | CourseWithSimilarity)[]>>,
        setAdditionalCourses: Dispatch<SetStateAction<(Course | CourseWithSimilarity)[]>>,
        setIsLoading: Dispatch<SetStateAction<boolean>>
    }) => {

    const [isSemanticSearch, setIsSemanticSearch] = useState(false);
    const [hideTaken, setHideTaken] = useState(false);
    const [hideUninterested, setHideUninterested] = useState(false);

    const { coursePreferences } = useContext(CoursePreferencesContext);

    function handleSemanticSearch(query: string) {
        setIsLoading(true);

        if (!query) {
            // Clear the search
            setCourses(courseData);
            setAdditionalCourses([]);
            setIsLoading(false);
            return;
        }

        let coursesAfterFilter = courseData;
        if (hideTaken) coursesAfterFilter = coursesAfterFilter.filter(course => coursePreferences[course.number] !== "taken");
        if (hideUninterested) coursesAfterFilter = coursesAfterFilter.filter(course => coursePreferences[course.number] !== "uninterested");

        const options = {
            method: "POST",
            url: "https://api.cohere.ai/v1/embed",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: "Bearer 0raSpWg7qGJC9WMO98zGGlrpx7O9onxj2k5Hccfh"
            },
            data: { texts: [query, ...coursesAfterFilter.map(course => course.title + "\n" + course.description)], truncate: "END" }
        };

        axios
            .request(options)
            .then(function (response) {
                // compute cosine similarity between each courses and the query
                const queryEmbedding: number[] = response.data.embeddings[0];
                const courseEmbeddings: number[][] = response.data.embeddings.slice(1);

                const similarities = courseEmbeddings.map(courseEmbedding => semanticSimilarity(queryEmbedding, courseEmbedding));

                const coursesWithSimilarities = courseData.map((course, i) => ({ ...course, similarity: similarities[i] }));

                console.time("sorting");
                const sortedCourses = coursesWithSimilarities.sort((a, b) => b.similarity - a.similarity);
                console.timeEnd("sorting");

                const filteredCourses = sortedCourses.filter(course => course.similarity >= 0.45);
                const filteredCourses2 = sortedCourses.filter(course => course.similarity < 0.45 && course.similarity >= 0.3);
                setCourses(filteredCourses);
                setAdditionalCourses(filteredCourses2);
                setIsLoading(false);

            })
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleTextSearch(query: string) {
        setIsLoading(true);

        if (!query) {
            // Clear the search
            setCourses(courseData);
            setAdditionalCourses([]);
            setIsLoading(false);
            return;
        }

        let coursesAfterFilter = courseData;
        if (hideTaken) coursesAfterFilter = coursesAfterFilter.filter(course => coursePreferences[course.number] !== "taken");
        if (hideUninterested) coursesAfterFilter = coursesAfterFilter.filter(course => coursePreferences[course.number] !== "uninterested");

        coursesAfterFilter = coursesAfterFilter.filter(course => matchQuery(query, course.dept + " " + course.number + "\n" + course.title + "\n" + course.description))
        setCourses(coursesAfterFilter);
        setAdditionalCourses([]);

        setIsLoading(false);
    }

    return (
        <>
            <div>
                <div className="flex items-center w-full px-8 gap-4">
                    {/* magnifying glass svg */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-stone-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>

                    <input
                        className="w-full py-2 mx-auto border-b border-stone-400 focus:outline-none focus:border-stone-600"
                        placeholder={isSemanticSearch ? "I want to learn about machine learning and artificial intelligence." : '"haskell" "rust" "240"'}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (isSemanticSearch) handleSemanticSearch(e.currentTarget.value);
                                else handleTextSearch(e.currentTarget.value);
                            }
                        }}
                    />
                </div>
                <p className="text-stone-400 text-right px-8 mt-3 text-xs">Enter to search</p>
            </div >

            <div className="flex w-full gap-4 mx-8 text-xs">
                <button
                    data-tooltip="Plain basic search, matches exactly what you type. Quotation marks can be used to simultaneously search for multiple queries."
                    className={`${isSemanticSearch ? "text-stone-500 transition hover:bg-stone-500 hover:text-white" : "bg-stone-500 text-white"} border-2 border-stone-500 p-2 rounded-md`}
                    onClick={() => setIsSemanticSearch(false)}
                >
                    Text search
                </button>
                <button
                    data-tooltip="AI-powered search, ranks courses based on semantic similarity to your query"
                    className="rainbow-border text-gray-700"
                    onClick={() => setIsSemanticSearch(true)}
                >
                    <span className={`inline-block p-2 px-4 rounded-md ${!isSemanticSearch && `bg-white hover:bg-transparent transition`}`}>Semantic search ✨</span>
                </button>

                <ToggleOptionsButton state={hideTaken} setState={setHideTaken} text="hide already taken courses" />
                <ToggleOptionsButton state={hideUninterested} setState={setHideUninterested} text="hide uninterested courses" />

            </div>
        </>
    )
}

const ToggleOptionsButton = ({ state, setState, text }: { state: boolean, setState: Dispatch<SetStateAction<boolean>>, text: string }) => (
    <button onClick={() => setState(prev => !prev)} className={"flex items-center gap-4 rounded-full px-3 text-upenn-blue border-2 border-upenn-blue " + (state ? "text-white bg-upenn-blue" : "")}>
        {state && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
        )}
        <span>{text}</span>
    </button>
)

export default SearchInput