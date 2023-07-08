import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'emoji-picker-element';
import {useState} from 'react';

const axiosGame = axios.create({
  baseURL:'http://localhost:3001/',
});

function App() {

  const [msg, setMsg] = useState(null);

  const handleButton = async ()=> {
    console.log('clicked!')
    const res = await axiosGame.get('/chef');
    setMsg(JSON.stringify(res.data));
    console.log(res);
  };
  
  return (
    <div className="App">
      <emoji-picker></emoji-picker>
      <button onClick={handleButton}>Click me</button>
      <p>{msg}</p>
    </div>
  );
}

export default App;
