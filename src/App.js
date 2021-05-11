import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'

function App() {
  const [count, setCount] = useState(1);
  return (
    <>
      Счёт: {count}
      <br />
      <button onClick={() => setCount(function (a) {return a -= 1})}>-</button>
      <button onClick={() => setCount(a => a + 1)}>+</button>
    </>
  );
}

export default App;