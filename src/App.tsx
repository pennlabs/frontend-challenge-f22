import { useState } from 'react';
import { ToastProps, ToastProvider } from 'react-toast-notifications';
import './App.css';

import Cart from './components/Cart';
import Courses from './components/Courses';
import Nav from './components/Nav';

import { DefaultToast } from 'react-toast-notifications';
export const MyCustomToast = ({ children, ...props }: ToastProps) => (

  <DefaultToast {...props}>
    <div>
      {/* todo: make bg penn themed colors */}
      {children}
    </div>
  </DefaultToast>
);


function App() {
  const [cart, setCart] = useState<number[]>([]); // stores course numbers, all courses are from the cis department
  return (
    <ToastProvider
      placement='top-center'
      components={{ Toast: MyCustomToast }}
    >
      <Nav />
      <div className='w-full px-4 max-w-4xl mx-auto'>
        <Courses setCart={setCart} cart={cart} />
        <Cart />
      </div>
    </ToastProvider >
  );
}

export default App;
