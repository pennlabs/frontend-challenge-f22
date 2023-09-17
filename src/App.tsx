import { useState } from 'react';
import './App.css';

import Cart from './components/Cart';
import Courses from './components/Courses';
import Nav from './components/Nav';

function App() {
  const [cart, setCart] = useState<number[]>([]); // stores course numbers, all courses are from the cis department
  return (
    <>
      <Nav />
      <div className='w-full px-4 max-w-4xl mx-auto'>
        <Courses setCart={setCart} />
        <Cart />
      </div>
    </>
  );
}

export default App;
