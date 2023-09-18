import { useState } from 'react';
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


function App() {
    const [courses, setCourses] = useState<Course[]>(courseData);
    const [courses2, setCourses2] = useState<Course[]>([]);

    const [cart, setCart] = useState<number[]>([]); // stores course numbers, all courses are from the cis department

    return (
        <ToastProvider
            placement='top-center'
            components={{ Toast: MyCustomToast }}
        >
            <Nav cart={cart} />
            <div className='my-8'>
                <SearchInput courseData={courseData} courses={courses} setCourses={setCourses} setCourses2={setCourses2} />
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
