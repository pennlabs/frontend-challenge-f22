import { Dispatch, SetStateAction } from 'react';
import { useToasts } from 'react-toast-notifications';
import courses from '../data/courses.json';

type Course = {
  dept: string;
  number: number;
  title: string;
  prereqs?: string[];
  crossListed?: string[];
}

const Courses = ({ setCart }: { setCart: Dispatch<SetStateAction<number[]>> }) => {
  const { addToast } = useToasts();

  function handleAddToCart(number: number) {
    setCart((prevCart) => [...prevCart, number]);
    addToast(<p className='bg-upenn-blue'>Added CIS {number} to cart! <a className="underline" href="https://lauragao.ca">View cart</a></p>, {
      appearance: 'success',
      autoDismiss: true,
      placement: 'top-center',
    });
  }

  return (
    <>
      {courses.map(({ dept, number, title, prereqs, crossListed, description }) => (
        <div key={`${dept}-${number}`} className="mb-8">
          <div className="flex items-center">
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

            <button className='w-10 h-10 ml-auto rounded-md p-2 bg-stone-200 hover:bg-stone-400 transition-colors' onClick={() => handleAddToCart(number)}>
              {/* plus sign svg */}
              <svg className='w-full h-full' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

            </button>
          </div>

          <p>
            {description}
          </p>

          {prereqs && (
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
          )}
        </div>
      ))}
    </>
  )
}

export default Courses;