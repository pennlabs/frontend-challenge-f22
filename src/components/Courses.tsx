import courses from '../data/courses.json'
import React, { useState } from 'react';
export type CoursesArray = Course[]

export interface Course {
  dept: string
  number: number
  title: string
  description: string
  prereqs: any
  "cross-listed"?: string[]
}

const Courses = () => {
  const initialCartState = courses.map(() => false); // Initialize cart state for each course
  const [cart, setCart] = useState(initialCartState);

  const handleToggleCartClick = (courseIndex: number) => {
    const updatedCart = [...cart];
    updatedCart[courseIndex] = !updatedCart[courseIndex]; // Toggle the state
    setCart(updatedCart);
    if (updatedCart[courseIndex]) {
      alert('Added to Cart');
    } else {
      alert('Removed from Cart');
    }
  };

  return (
    <>
      {courses.map(({ dept, number, title, description, prereqs, "cross-listed": crossListed }, index) => (
        <div key={`${dept}-${number}`}>
          <br />
          <b>{dept} {number}: {title}</b>
          <br />
          {description}
          {prereqs && prereqs.length > 0 && (
            <>
              <br />
              <i> Prerequisites: {Array.isArray(prereqs) ? prereqs.join(', ') : prereqs} </i>
            </>
          )}
          {crossListed && crossListed.length > 0 && (
            <>
              <br />
              Cross-listed: {crossListed.join(', ')}
            </>
          )}
          <div>
            <button onClick={() => handleToggleCartClick(index)}>
              {cart[index] ? 'Remove from Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Courses;