import axios from 'axios';
import { useState } from 'react';
import { DefaultToast, ToastProps, ToastProvider } from 'react-toast-notifications';
import './App.css';
import Cart from './components/Cart';
import Courses from './components/Courses';
import Nav from './components/Nav';
import courseData from './data/courses.json';
import { Course } from './types';

export const MyCustomToast = ({ children, ...props }: ToastProps) => (

    <DefaultToast {...props}>
        <div>
            {/* todo: make bg penn themed colors */}
            {children}
        </div>
    </DefaultToast>
);

interface CoursePreference {
    [key: number]: "cart" | "taken" | "uninterested" | "none";
}


function semanticSimilarity(a: number[], b: number[]) {
    const dot = (a: Float64Array, b: Float64Array) =>
        a.reduce((prev, curr, index) => prev + curr * b[index]);

    const norm = (x: Float64Array) =>
        Math.sqrt(x.reduce((prev, curr) => prev + curr * curr));

    const aEmbed = new Float64Array(a);
    const bEmbed = new Float64Array(b);
    return dot(aEmbed, bEmbed) / (norm(aEmbed) * norm(bEmbed));
}

function App() {

    const [courses, setCourses] = useState<Course[]>(courseData);
    const [courses2, setCourses2] = useState<Course[]>([]);
    const [isSemanticSearch, setIsSemanticSearch] = useState(false);

    function handleSemanticSearch(query: string) {

        const options = {
            method: 'POST',
            url: 'https://api.cohere.ai/v1/embed',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Bearer 0raSpWg7qGJC9WMO98zGGlrpx7O9onxj2k5Hccfh'
            },
            data: { texts: [query, ...courseData.map(course => course.title + "\n" + course.description)], truncate: 'END' }
        };

        axios
            .request(options)
            .then(function (response) {
                // compute cosine similarity between each courses and the query
                const queryEmbedding: number[] = response.data.embeddings[0];
                const courseEmbeddings: number[][] = response.data.embeddings.slice(1);

                const similarities = courseEmbeddings.map(courseEmbedding => semanticSimilarity(queryEmbedding, courseEmbedding));
                // console.log(similarities)

                const coursesWithSimilarities = courseData.map((course, i) => ({ ...course, similarity: similarities[i] }));

                console.time('sorting');
                const sortedCourses = coursesWithSimilarities.sort((a, b) => b.similarity - a.similarity);
                console.timeEnd('sorting');

                const filteredCourses = sortedCourses.filter(course => course.similarity >= 0.45);
                const filteredCourses2 = sortedCourses.filter(course => course.similarity < 0.45 && course.similarity >= 0.3);
                setCourses(filteredCourses);
                setCourses2(filteredCourses2);

            })
            .catch(function (error) {
                console.error(error);
            });
    }


    const [cart, setCart] = useState<number[]>([]); // stores course numbers, all courses are from the cis department
    return (
        <ToastProvider
            placement='top-center'
            components={{ Toast: MyCustomToast }}
        >
            <Nav cart={cart} />
            <div className='my-8'>
                <div className='flex items-center w-full px-8 gap-4'>
                    {/* magnifying glass svg */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-stone-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>

                    <input
                        className='w-full py-2 mx-auto border-b border-stone-400 focus:outline-none focus:border-stone-600'
                        placeholder="I want to learn about machine learning and artificial intelligence."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSemanticSearch(e.currentTarget.value);
                            }
                        }}
                    />
                </div>
                <p className='text-stone-400 text-right px-8 mt-3'>Enter to search</p>
            </div>
            <div className='flex w-full'>
                <div >
                    <p className='text-stone-400'>Showing {courses.length} results</p>
                </div>
                <div className='flex gap-4'>
                    <button
                        data-tooltip="Plain basic search, matches exactly what you type"
                        className={`${isSemanticSearch ? "text-stone-500 transition hover:bg-stone-500 hover:text-white" : "bg-stone-500 text-white"} border-2 border-stone-500 p-2 rounded-md`}
                        onClick={() => setIsSemanticSearch(false)}
                    >
                        Text search
                    </button>
                    <button
                        data-tooltip="AI-powered search, ranks courses based on semantic similarity to your query"
                        className='rainbow-border text-gray-700'
                        onClick={() => setIsSemanticSearch(true)}
                    >
                        <span className={`inline-block p-2 px-4 rounded-md ${!isSemanticSearch && `bg-white hover:bg-transparent transition`}`}>Semantic search ✨</span>
                    </button>

                </div>
            </div>
            <div className='w-full px-4 max-w-4xl mx-auto'>
                <Courses courses={courses} setCart={setCart} cart={cart} />
                <p className='text-center my-12 text-stone-400 text-xl'>you might also like:</p>
                {courses2.length > 0 && <Courses courses={courses2} setCart={setCart} cart={cart} />}
                <Cart />
            </div>
        </ToastProvider >
    );
}

export default App;
