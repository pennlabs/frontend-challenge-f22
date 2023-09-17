import { Dispatch, SetStateAction, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import useSWR from 'swr';
import { Course } from '../types';



// ```jsx
// fetch('/api/base/2022A/courses/CIS-120/')
// 	.then(res => res.json())
// 	.then(console.log);
// ```

const fetcher = async (url: string) => fetch(url).then(res => res.json())



const Courses = ({ courses, cart, setCart }: { courses: Course[], cart: number[], setCart: Dispatch<SetStateAction<number[]>> }) => {
    const [takenCourses, setTakenCourses] = useState<number[]>([]); // stores course numbers, all courses are from the cis department
    const { addToast } = useToasts();


    function handleAddToCart(number: number) {
        const course = courses.find((course) => course.number === number);
        // if (course?.prereqs) {
        //   const missingPrereqs = course.prereqs.filter((prereq) => !alreadyTakenCourses.includes(prereq));
        //   if (missingPrereqs.length > 0) {
        //     addToast(<p className='bg-upenn-blue'>You are missing the following prerequisites: {missingPrereqs.join(', ')}</p>, {
        //       appearance: 'warning',
        //       autoDismiss: true,
        //       placement: 'top-center',
        //     });
        //   }
        // }

        setCart((prevCart) => [...prevCart, number]);
        addToast(<p className='bg-upenn-blue'>Added CIS {number} to cart! <a className="underline" href="https://lauragao.ca">View cart</a></p>, {
            appearance: 'success',
            autoDismiss: true,
            placement: 'top-center',
        });
    }


    return (
        <div className="grid grid-cols-2 gap-8">
            {courses.map(course => <CourseCard key={course.number} course={course} handleAddToCart={handleAddToCart} cart={cart} />)}
        </div>

    )
}

export default Courses;

function CourseCard({ course, handleAddToCart, cart }: { course: Course, handleAddToCart: (number: number) => void, cart: number[] }) {
    const { dept, number, title, prereqs, description } = course;
    const isInCart = cart.includes(number);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isUninterested, setIsUninterested] = useState(false);
    const [isTaken, setIsTaken] = useState(false);

    const { data, error, isLoading } = useSWR('/api/base/2022A/courses/CIS-120/', fetcher)




    return (
        <div className={`relative p-8 rounded-xl transition hover:border-stone-400 border-transparent border ${(isTaken || isUninterested) && "opacity-50"}`}>
            {isTaken && (
                <div className="absolute w-full h-full opacity-20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                </div>

            )}
            <div className="flex items-center gap-8">
                <div>
                    <p className="font-bold uppercase text-sm text-stone-400">
                        {dept}
                        {' '}
                        {number}
                    </p>
                    <h2 className="font-bold text-3xl">
                        {title}
                    </h2>
                </div>

                <div className="flex flex-row gap-4 ml-auto">
                    {!(isTaken || isUninterested) && <button
                        className='w-10 h-10 rounded-md p-2 bg-stone-200 hover:bg-stone-400 transition-colors'
                        onClick={() => handleAddToCart(number)}
                        data-tooltip={isInCart ? "View cart" : "Add to cart"}
                    >
                        {isInCart ? (
                            // shopping cart svg
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                            </svg>
                        ) : (
                            /* plus sign svg */
                            <svg className='w-full h-full' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                        )}
                    </button>}

                    <div className='relative'>
                        {/* menu */}
                        <button className='menu-icon w-10 h-10'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>

                        <div className='absolute bg-white text-sm text-left hidden menu'>
                            <button className="flex p-2 hover:bg-stone-50" onClick={() => setIsTaken(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                                Mark as taken
                            </button>
                            <button className='flex p-2 hover:bg-stone-50' onClick={() => setIsUninterested(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>

                                Mark as not interested
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <p>
                {description}
            </p>

            {
                prereqs && (
                    <p className="my-1 text-stone-500">
                        Prerequisites:
                        {' '}
                        {prereqs.map((prereq, i) => (
                            <span key={prereq}>
                                {i > 0 && ', '}
                                {prereq}
                            </span>
                        ))}
                    </p>
                )
            }
        </div >
    )
}