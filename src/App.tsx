import './App.css';

import Nav from './components/Nav';
import Courses from './components/Courses';
import Cart from './components/Cart';

function App() {
  return (
    <>
      <Nav />
      <div style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '0 calc(1rem + 10%)',
      }}>
        <Courses />
        <Cart />
      </div>
    </>
  );
}

export default App;
