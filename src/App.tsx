import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DefaultToast, ToastProps, ToastProvider } from 'react-toast-notifications';
import './App.css';
import Cart from './components/Cart';
import Courses from './components/Courses';
import Nav from './components/Nav';
import SearchInput from './components/SearchInput';
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


function LoadingCourse() {
    return (
        <div>
            <Skeleton width={70} />
            <Skeleton height={70} />
            <Skeleton count={11} />
        </div>
    )
}

function App() {
    const [courses, setCourses] = useState<Course[]>(courseData);
    const [courses2, setCourses2] = useState<Course[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const [cart, setCart] = useState<number[]>([]); // stores course numbers, all courses are from the cis department

    return (
        <ToastProvider
            placement='top-center'
            components={{ Toast: MyCustomToast }}
        >
            <Nav cart={cart} />
            <div className='my-8'>
                <SearchInput courseData={courseData} courses={courses} setCourses={setCourses} setCourses2={setCourses2} setIsLoading={setIsSearchLoading} />
            </div>

            <div className='w-full px-4 max-w-4xl mx-auto'>
                {isSearchLoading ? (
                    <div className='grid grid-cols-2 gap-8'>
                        <LoadingCourse />
                        <LoadingCourse />
                        <LoadingCourse />
                        <LoadingCourse />
                    </div>
                ) : (
                    <>
                        <p className='text-stone-400'>Showing {courses.length} results</p>
                        <Courses courses={courses} setCart={setCart} cart={cart} />
                        {courses2.length > 0 && <p className='text-center my-12 text-stone-400 text-xl'>You might also like:</p>}
                        <Courses courses={courses2} setCart={setCart} cart={cart} />
                    </>
                )}
                <Cart />
            </div>
        </ToastProvider >
    );
}

export default App;
